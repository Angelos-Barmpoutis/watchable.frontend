import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { Movie } from '../../core/models/movies/movie.model';
import { NowPlayingResponse } from '../../core/models/movies/responses/now-playing.model';
import { TopRatedResponse } from '../../core/models/movies/responses/top-rated.model';
import { TrendingResponse } from '../../core/models/movies/responses/trending.model';
import { UpcomingResponse } from '../../core/models/movies/responses/upcoming.model';
import { UrlService } from '../../core/services/url.service';
import { PosterPathDirective } from '../../shared/directives/poster-path.directive';

@Component({
    selector: 'app-movies',
    standalone: true,
    imports: [CommonModule, PosterPathDirective],
    templateUrl: './movies.component.html',
    styleUrl: './movies.component.scss',
})
export class MoviesComponent implements OnInit {
    nowPlaying: Array<Movie> = [];
    popular: Array<Movie> = [];
    topRated: Array<Movie> = [];
    trending: Array<Movie> = [];
    upcoming: Array<Movie> = [];
    trendingObservable = this.httpService.get<TrendingResponse>(this.urlService.urlFor(['trending', 'movie', 'day']));
    nowPlayingObservable = this.httpService.get<NowPlayingResponse>(this.urlService.urlFor(['movie', 'now_playing']));
    popularObservable = this.httpService.get<TopRatedResponse>(this.urlService.urlFor(['movie', 'top_rated']));
    topRatedObservable = this.httpService.get<TopRatedResponse>(this.urlService.urlFor(['movie', 'top_rated']));
    upcomingObservable = this.httpService.get<UpcomingResponse>(this.urlService.urlFor(['movie', 'upcoming']));

    constructor(
        private httpService: HttpClient,
        private urlService: UrlService,
    ) {}

    ngOnInit(): void {
        forkJoin([
            this.trendingObservable,
            this.nowPlayingObservable,
            this.popularObservable,
            this.topRatedObservable,
            this.upcomingObservable,
        ]).subscribe(([trending, nowPlaying, popular, topRated, upcoming]) => {
            this.trending = trending.results.slice(0, 10);

            nowPlaying.results.forEach((movie) => {
                if (
                    !this.trending.find((trendingMovie) => {
                        console.log(trendingMovie);
                        trendingMovie.id === movie.id;
                    })
                ) {
                    this.nowPlaying.push(movie);
                }
            });
            console.log(this.nowPlaying);

            // this.nowPlaying = nowPlaying.results.slice(0, 10);
            this.popular = popular.results.slice(0, 10);
            this.topRated = topRated.results.slice(0, 10);
            this.upcoming = upcoming.results.slice(0, 10);

            // console.log(this.trending[0]);
            // console.log(this.nowPlaying[0]);
        });
    }
}
