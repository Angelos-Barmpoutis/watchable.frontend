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
    selector: 'app-top-rated-movies',
    standalone: true,
    providers: [],
    templateUrl: './top-rated.component.html',
    styleUrl: './top-rated.component.scss',
    imports: [CommonModule, PosterPathDirective, RouterLink],
})
export class MoviesTopRatedComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.smallPosterSize;
    public posterFallback = DEFAULT.smallPosterFallback;
    public topRatedMovies: Array<Movie> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;

    constructor(
        private movieFacade: MoviesFacade,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.getTopRatedMovies();
    }

    public onLoadMore(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.getTopRatedMovies(true);
        }
    }

    private getTopRatedMovies(loadMore: boolean = false): void {
        this.movieFacade
            .getTopRated(this.currentPage)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((topRatedMovies) => {
                if (loadMore) {
                    this.topRatedMovies = [...this.topRatedMovies, ...topRatedMovies.results];
                } else {
                    this.topRatedMovies = topRatedMovies.results;
                }

                this.currentPage = topRatedMovies.page;
                this.totalPages = topRatedMovies.total_pages;
            });
    }
}
