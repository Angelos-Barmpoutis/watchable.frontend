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
    selector: 'app-upcoming-movies',
    standalone: true,
    providers: [],
    templateUrl: './upcoming.component.html',
    styleUrl: './upcoming.component.scss',
    imports: [CommonModule, PosterPathDirective, RouterLink],
})
export class MoviesUpcomingComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.smallPosterSize;
    public posterFallback = DEFAULT.smallPosterFallback;
    public upcomingMovies: Array<Movie> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;

    constructor(
        private movieFacade: MoviesFacade,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.getUpcomingMovies();
    }

    public onLoadMore(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.getUpcomingMovies(true);
        }
    }

    private getUpcomingMovies(loadMore: boolean = false): void {
        this.movieFacade
            .getUpcoming(this.currentPage)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((upcomingMovies) => {
                if (loadMore) {
                    this.upcomingMovies = [...this.upcomingMovies, ...upcomingMovies.results];
                } else {
                    this.upcomingMovies = upcomingMovies.results;
                }

                this.currentPage = upcomingMovies.page;
                this.totalPages = upcomingMovies.total_pages;
            });
    }
}
