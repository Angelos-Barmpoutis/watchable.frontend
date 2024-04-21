import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { Movie } from '../../core/models/movies/movie.model';
import { NowPlayingResponse } from '../../core/models/movies/responses/now-playing.model';
import { PopularResponse } from '../../core/models/movies/responses/popular.model';
import { TopRatedResponse } from '../../core/models/movies/responses/top-rated.model';
import { TrendingResponse } from '../../core/models/movies/responses/trending.model';
import { UpcomingResponse } from '../../core/models/movies/responses/upcoming.model';
import { PosterPathDirective } from '../../shared/directives/poster-path.directive';
import { MovieService } from '../../shared/services/movie.service';

@Component({
    selector: 'app-movies',
    standalone: true,
    imports: [CommonModule, PosterPathDirective],
    providers: [MovieService],
    templateUrl: './movies.component.html',
    styleUrl: './movies.component.scss',
})
export class MoviesComponent implements OnInit {
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
    constructor(private movieService: MovieService) {}

    ngOnInit(): void {
        forkJoin([
            this.trendingObservable,
            this.nowPlayingObservable,
            this.popularObservable,
            this.topRatedObservable,
            this.upcomingObservable,
        ]).subscribe(([trending, nowPlaying, popular, topRated, upcoming]) => {
            this.getMovies(trending, nowPlaying, popular, topRated, upcoming);
        });
    }

    getTrending(): Observable<TrendingResponse> {
        return this.movieService.getTrending();
    }

    getNowPlaying(): Observable<NowPlayingResponse> {
        return this.movieService.getNowPlaying();
    }

    getPopular(): Observable<PopularResponse> {
        return this.movieService.getPopular();
    }

    getTopRated(): Observable<TopRatedResponse> {
        return this.movieService.getTopRated();
    }

    getUpcoming(): Observable<UpcomingResponse> {
        return this.movieService.getUpcoming();
    }

    private getMovies(
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
