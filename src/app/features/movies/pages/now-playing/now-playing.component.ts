import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntil } from 'rxjs';

import { POSTER_SIZE } from '../../../../core/enumerations/poster-size.enum';
import { Movie } from '../../../../core/models/movies/movie.model';
import { PosterPathDirective } from '../../../../shared/directives/poster-path.directive';
import { MoviesFacade } from '../../../../shared/facades/movies.facade';
import { BaseComponent } from '../../../../shared/helpers/base.component';

@Component({
    selector: 'app-movies',
    standalone: true,
    providers: [],
    templateUrl: './now-playing.component.html',
    styleUrl: './now-playing.component.scss',
    imports: [CommonModule, PosterPathDirective, RouterLink],
})
export class MoviesNowPlayingComponent extends BaseComponent implements OnInit {
    public posterSize: POSTER_SIZE = POSTER_SIZE.w92;
    public nowPlayingMovies: Array<Movie> = [];
    public currentPage = 1;
    public totalPages = 10;

    constructor(private movieFacade: MoviesFacade) {
        super();
    }

    ngOnInit(): void {
        this.getNowPlayingMovies();
    }

    public onLoadMore(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.getNowPlayingMovies(true);
        }
    }

    private getNowPlayingMovies(loadMore: boolean = false): void {
        this.movieFacade
            .getNowPlaying(this.currentPage)
            .pipe(takeUntil(this.destroyed))
            .subscribe((nowPlayingMovies) => {
                if (loadMore) {
                    this.nowPlayingMovies = [...this.nowPlayingMovies, ...nowPlayingMovies.results];
                } else {
                    this.nowPlayingMovies = nowPlayingMovies.results;
                }

                this.currentPage = +nowPlayingMovies.page;
                this.totalPages = +nowPlayingMovies.total_pages;
            });
    }
}
