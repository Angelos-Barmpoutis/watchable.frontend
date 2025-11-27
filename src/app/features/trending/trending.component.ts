import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';

import { CarouselMediaComponent } from '../../shared/components/carousel-media/carousel-media.component';
import { CarouselPersonComponent } from '../../shared/components/carousel-person/carousel-person.component';
import { FeaturedBannerComponent } from '../../shared/components/featured-banner/featured-banner.component';
import { InfiniteScrollLoaderComponent } from '../../shared/components/infinite-scroll-loader/infinite-scroll-loader.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { DEFAULT } from '../../shared/constants/defaults.constant';
import { MediaType } from '../../shared/enumerations/media-type.enum';
import { TrendingFacade } from '../../shared/facades/trending.facade';
import { filterMediaItems, filterPersonItems } from '../../shared/helpers/filter-items.helper';
import { Genre } from '../../shared/models/genre.model';
import { Movie } from '../../shared/models/movie.model';
import { Person } from '../../shared/models/people.model';
import { TvShow } from '../../shared/models/tv-show.model';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Component({
    standalone: true,
    selector: 'app-trending',
    templateUrl: './trending.component.html',
    styleUrl: './trending.component.scss',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SectionHeaderComponent,
        CarouselMediaComponent,
        CarouselPersonComponent,
        InfiniteScrollLoaderComponent,
        FeaturedBannerComponent,
    ],
})
export class TrendingComponent implements OnInit {
    readonly mediaType = MediaType;
    currentMovieGenreIndex = 0;
    currentTvShowGenreIndex = 0;
    genresPerBatch = DEFAULT.genresBatchSize;
    isMainContentLoading = false;
    isLoadingMoreGenres = false;
    allGenresLoaded = false;
    trendingMovies: Array<Movie> = [];
    trendingTvShows: Array<TvShow> = [];
    trendingPeople: Array<Person> = [];
    movieGenres: Array<Genre> = [];
    tvShowGenres: Array<Genre> = [];
    loadedGenres: Array<{
        type: MediaType.Movie | MediaType.TvShow;
        genreName: string;
        genreId: number;
        items: Array<Movie | TvShow>;
    }> = [];

    constructor(
        private trendingFacade: TrendingFacade,
        private destroyRef: DestroyRef,
        private localStorageService: LocalStorageService,
    ) {}

    ngOnInit(): void {
        this.getStoredGenres();
        this.getAllTrending();
    }

    private getStoredGenres(): void {
        this.movieGenres = this.localStorageService.getItem<Array<Genre>>('movieGenres') ?? [];
        this.tvShowGenres = this.localStorageService.getItem<Array<Genre>>('tvShowGenres') ?? [];
    }

    private getAllTrending(): void {
        this.isMainContentLoading = true;

        this.trendingFacade
            .getAllTrending()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((results) => {
                this.trendingMovies = filterMediaItems(results.movies.results);
                this.trendingTvShows = filterMediaItems(results.tvShows.results);
                this.trendingPeople = filterPersonItems(results.people.results);
                this.isMainContentLoading = false;
            });
    }

    loadMore(): void {
        if (
            this.currentMovieGenreIndex >= this.movieGenres.length &&
            this.currentTvShowGenreIndex >= this.tvShowGenres.length
        ) {
            this.allGenresLoaded = true;
            return;
        }

        this.loadMoreGenres();
    }

    private loadMoreGenres(): void {
        this.isLoadingMoreGenres = true;

        this.trendingFacade
            .getMoviesAndTvShowsByGenreIds(
                this.currentMovieGenreIndex,
                this.currentTvShowGenreIndex,
                this.genresPerBatch,
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((results) => {
                Object.entries(results).forEach(([key, value]) => {
                    const [type, genreName] = key.split('_');
                    const items = filterMediaItems(value.results);

                    if (items.length > 0) {
                        const genreId =
                            type === 'movie'
                                ? this.movieGenres.find((g) => g.name === genreName)?.id
                                : this.tvShowGenres.find((g) => g.name === genreName)?.id;

                        if (genreId) {
                            this.loadedGenres.push({
                                type: type as MediaType.Movie | MediaType.TvShow,
                                genreName,
                                genreId,
                                items: items,
                            });
                        }
                    }
                });

                // Update indices for next batch
                this.currentMovieGenreIndex += Math.ceil(this.genresPerBatch / 2);
                this.currentTvShowGenreIndex += Math.ceil(this.genresPerBatch / 2);

                // Check if we've loaded all genres
                this.allGenresLoaded =
                    this.currentMovieGenreIndex >= this.movieGenres.length &&
                    this.currentTvShowGenreIndex >= this.tvShowGenres.length;

                this.isLoadingMoreGenres = false;
            });
    }
}
