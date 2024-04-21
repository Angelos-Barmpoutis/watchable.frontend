import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, Observable, takeUntil } from 'rxjs';

import { TrendingFilter } from '../../core/enumerations/trending-filter.enum';
import { Movie } from '../../core/models/movies/movie.model';
import { NowPlayingResponse } from '../../core/models/movies/responses/now-playing.model';
import { PopularResponse } from '../../core/models/movies/responses/popular.model';
import { TopRatedResponse } from '../../core/models/movies/responses/top-rated.model';
import { TrendingResponse } from '../../core/models/movies/responses/trending.model';
import { UpcomingResponse } from '../../core/models/movies/responses/upcoming.model';
import { PageLoaderService } from '../../core/services/page-loader.service';
import { SectionLoaderService } from '../../core/services/section-loader.service';
import { SectionLoaderComponent } from '../../shared/components/section-loader/section-loader.component';
import { PosterPathDirective } from '../../shared/directives/poster-path.directive';
import { BaseComponent } from '../../shared/helpers/base.component';
import { MovieService } from '../../shared/services/movie.service';

@Component({
    selector: 'app-movies',
    standalone: true,
    providers: [MovieService, SectionLoaderService],
    templateUrl: './movies.component.html',
    styleUrl: './movies.component.scss',
    imports: [CommonModule, PosterPathDirective, ReactiveFormsModule, SectionLoaderComponent],
})
export class MoviesComponent extends BaseComponent implements OnInit {
    TRENDING_FILTER = TrendingFilter;

    trendingFilter = TrendingFilter.Day;
    trendingForm: FormGroup;

    trending: Array<Movie> = [];
    nowPlaying: Array<Movie> = [];
    popular: Array<Movie> = [];
    topRated: Array<Movie> = [];
    upcoming: Array<Movie> = [];

    trendingObservable = this.getTrending();
    nowPlayingObservable = this.getNowPlaying();
    popularObservable = this.getPopular();
    topRatedObservable = this.getTopRated();
    upcomingObservable = this.getUpcoming();

    isSectionloading = false;

    constructor(
        private movieService: MovieService,
        private pageLoaderService: PageLoaderService,
        private sectionLoaderService: SectionLoaderService,
        private formBuilder: FormBuilder,
    ) {
        super();
        this.pageLoaderService.showLoader();

        this.sectionLoaderService.loading$.pipe(takeUntil(this.destroyed)).subscribe((isSectionloading) => {
            this.isSectionloading = isSectionloading;
        });

        this.trendingForm = this.formBuilder.group({
            filter: this.trendingFilter,
        });

        this.trendingForm.valueChanges
            .pipe(takeUntil(this.destroyed))
            .subscribe((formValue: { filter: TrendingFilter }) => {
                this.sectionLoaderService.showLoader();
                this.filterTrending(formValue.filter);
            });
    }

    ngOnInit(): void {
        forkJoin([
            this.trendingObservable,
            this.nowPlayingObservable,
            this.popularObservable,
            this.topRatedObservable,
            this.upcomingObservable,
        ])
            .pipe(takeUntil(this.destroyed))
            .subscribe(([trending, nowPlaying, popular, topRated, upcoming]) => {
                this.populateMovies(trending, nowPlaying, popular, topRated, upcoming);
                this.pageLoaderService.hideLoader();
            });
    }

    private getTrending(trendingFilter = this.trendingFilter): Observable<TrendingResponse> {
        return this.movieService.getTrending(trendingFilter);
    }

    private getNowPlaying(): Observable<NowPlayingResponse> {
        return this.movieService.getNowPlaying();
    }

    private getPopular(): Observable<PopularResponse> {
        return this.movieService.getPopular();
    }

    private getTopRated(): Observable<TopRatedResponse> {
        return this.movieService.getTopRated();
    }

    private getUpcoming(): Observable<UpcomingResponse> {
        return this.movieService.getUpcoming();
    }

    private filterTrending(trendingFilter: TrendingFilter): void {
        this.getTrending(trendingFilter)
            .pipe(takeUntil(this.destroyed))
            .subscribe((trending) => {
                this.trending = trending.results.slice(0, 10);
                this.sectionLoaderService.hideLoader();
            });
    }

    private populateMovies(
        trending: TrendingResponse,
        nowPlaying: NowPlayingResponse,
        popular: PopularResponse,
        topRated: TopRatedResponse,
        upcoming: UpcomingResponse,
    ): void {
        this.trending = trending.results.slice(0, 10);

        nowPlaying.results.forEach((movie) => {
            if (!this.existsInCategory(movie, this.trending)) {
                this.nowPlaying.push(movie);
            }
        });
        this.nowPlaying = this.nowPlaying.slice(0, 10);

        popular.results.forEach((movie, movieIndex) => {
            const remaining = popular.results.length - movieIndex;

            if (!this.existsInCategory(movie, this.trending) && !this.existsInCategory(movie, this.nowPlaying)) {
                this.popular.push(movie);
            } else if (this.popular.length + remaining === 10) {
                this.popular.push(movie);
            }
        });

        this.popular = this.popular.slice(0, 10);

        topRated.results.forEach((movie, movieIndex) => {
            const remaining = topRated.results.length - movieIndex;

            if (
                !this.existsInCategory(movie, this.trending) &&
                !this.existsInCategory(movie, this.nowPlaying) &&
                !this.existsInCategory(movie, this.popular)
            ) {
                this.topRated.push(movie);
            } else if (this.topRated.length + remaining === 10) {
                this.topRated.push(movie);
            }
        });

        this.topRated = this.topRated.slice(0, 10);

        upcoming.results.forEach((movie, movieIndex) => {
            const remaining = upcoming.results.length - movieIndex;

            if (
                !this.existsInCategory(movie, this.trending) &&
                !this.existsInCategory(movie, this.nowPlaying) &&
                !this.existsInCategory(movie, this.popular) &&
                !this.existsInCategory(movie, this.topRated)
            ) {
                this.upcoming.push(movie);
            } else if (this.upcoming.length + remaining === 10) {
                this.upcoming.push(movie);
            }
        });

        this.upcoming = this.upcoming.slice(0, 10);
    }

    private existsInCategory(movie: Movie, category: Array<Movie>): boolean {
        return category.some((categoryMovie) => movie.id === categoryMovie.id);
    }
}
