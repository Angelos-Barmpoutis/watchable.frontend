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
    selector: 'app-popular-movies',
    standalone: true,
    providers: [],
    templateUrl: './popular.component.html',
    styleUrl: './popular.component.scss',
    imports: [CommonModule, PosterPathDirective, RouterLink],
})
export class MoviesPopularComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.smallPosterSize;
    public posterFallback = DEFAULT.smallPosterFallback;
    public popularMovies: Array<Movie> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;

    constructor(
        private movieFacade: MoviesFacade,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.getPopularMovies();
    }

    public onLoadMore(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.getPopularMovies(true);
        }
    }

    private getPopularMovies(loadMore: boolean = false): void {
        this.movieFacade
            .getPopular(this.currentPage)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((popularMovies) => {
                if (loadMore) {
                    this.popularMovies = [...this.popularMovies, ...popularMovies.results];
                } else {
                    this.popularMovies = popularMovies.results;
                }

                this.currentPage = popularMovies.page;
                this.totalPages = popularMovies.total_pages;
            });
    }
}
