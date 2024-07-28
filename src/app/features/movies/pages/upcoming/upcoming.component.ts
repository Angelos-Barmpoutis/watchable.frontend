import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntil } from 'rxjs';

import { POSTER_SIZE } from '../../../../core/enumerations/poster-size.enum';
import { Movie } from '../../../../core/models/movies/movie.model';
import { DEFAULT } from '../../../../shared/constants/defaults.constant';
import { PosterPathDirective } from '../../../../shared/directives/poster-path.directive';
import { MoviesFacade } from '../../../../shared/facades/movies.facade';
import { BaseComponent } from '../../../../shared/helpers/base.component';

@Component({
    selector: 'app-movies',
    standalone: true,
    providers: [],
    templateUrl: './upcoming.component.html',
    styleUrl: './upcoming.component.scss',
    imports: [CommonModule, PosterPathDirective, RouterLink],
})
export class MoviesUpcomingComponent extends BaseComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.smallPosterSize;
    public posterFallback = DEFAULT.smallPosterFallback;
    public upcomingMovies: Array<Movie> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;

    constructor(private movieFacade: MoviesFacade) {
        super();
    }

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
            .pipe(takeUntil(this.destroyed))
            .subscribe((upcomingMovies) => {
                if (loadMore) {
                    this.upcomingMovies = [...this.upcomingMovies, ...upcomingMovies.results];
                } else {
                    this.upcomingMovies = upcomingMovies.results;
                }

                this.currentPage = +upcomingMovies.page;
                this.totalPages = +upcomingMovies.total_pages;
            });
    }
}
