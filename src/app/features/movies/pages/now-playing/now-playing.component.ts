import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../../../shared/constants/defaults.constant';
import { PosterPathDirective } from '../../../../shared/directives/poster-path.directive';
import { POSTER_SIZE } from '../../../../shared/enumerations/poster-size.enum';
import { MoviesFacade } from '../../../../shared/facades/movies.facade';
import { Movie } from '../../../../shared/models/movies/movie.model';

@Component({
    selector: 'app-/now-playing-movies',
    standalone: true,
    providers: [],
    templateUrl: './now-playing.component.html',
    styleUrl: './now-playing.component.scss',
    imports: [CommonModule, PosterPathDirective, RouterLink],
})
export class MoviesNowPlayingComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.mediumPosterSize;
    public posterFallback = DEFAULT.mediumPosterFallback;
    public nowPlayingMovies: Array<Movie> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;

    constructor(
        private movieFacade: MoviesFacade,
        private destroyRef: DestroyRef,
    ) {}

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
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((nowPlayingMovies) => {
                if (loadMore) {
                    this.nowPlayingMovies = [...this.nowPlayingMovies, ...nowPlayingMovies.results];
                } else {
                    this.nowPlayingMovies = nowPlayingMovies.results;
                }

                this.currentPage = nowPlayingMovies.page;
                this.totalPages = nowPlayingMovies.total_pages;
            });
    }
}
