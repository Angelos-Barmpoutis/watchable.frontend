import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { Movie } from '../../core/models/movies/movie.model';
import { NowPlayingResponse } from '../../core/models/movies/responses/now-playing.model';
import { PopularResponse } from '../../core/models/movies/responses/popular.model';
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
    nowPlayingMovies: Array<Movie> = [];
    popularMovies: Array<Movie> = [];
    topRatedMovies: Array<Movie> = [];
    trendingMovies: Array<Movie> = [];
    upcomingMovies: Array<Movie> = [];

    constructor(
        private httpService: HttpClient,
        private urlService: UrlService,
    ) {}

    ngOnInit(): void {
        this.httpService
            .get<NowPlayingResponse>(this.urlService.urlFor(['movie', 'now_playing']))
            .subscribe((response) => {
                this.nowPlayingMovies = response.results.slice(0, 10);
            });

        this.httpService.get<PopularResponse>(this.urlService.urlFor(['movie', 'popular'])).subscribe((response) => {
            this.popularMovies = response.results.slice(0, 10);
        });

        this.httpService.get<TopRatedResponse>(this.urlService.urlFor(['movie', 'top_rated'])).subscribe((response) => {
            this.topRatedMovies = response.results.slice(0, 10);
        });

        this.httpService
            .get<TrendingResponse>(this.urlService.urlFor(['trending', 'movie', 'day']))
            .subscribe((response) => {
                this.trendingMovies = response.results.slice(0, 10);
            });

        this.httpService.get<UpcomingResponse>(this.urlService.urlFor(['movie', 'upcoming'])).subscribe((response) => {
            this.upcomingMovies = response.results.slice(0, 10);
        });
    }
}
