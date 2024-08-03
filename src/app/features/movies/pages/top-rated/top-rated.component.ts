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
    selector: 'app-top-rated-movies',
    standalone: true,
    providers: [],
    templateUrl: './top-rated.component.html',
    styleUrl: './top-rated.component.scss',
    imports: [CommonModule, PosterPathDirective, RouterLink],
})
export class MoviesTopRatedComponent extends BaseComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.smallPosterSize;
    public posterFallback = DEFAULT.smallPosterFallback;
    public topRatedMovies: Array<Movie> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;

    constructor(private movieFacade: MoviesFacade) {
        super();
    }

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
            .pipe(takeUntil(this.destroyed))
            .subscribe((topRatedMovies) => {
                if (loadMore) {
                    this.topRatedMovies = [...this.topRatedMovies, ...topRatedMovies.results];
                } else {
                    this.topRatedMovies = topRatedMovies.results;
                }

                this.currentPage = +topRatedMovies.page;
                this.totalPages = +topRatedMovies.total_pages;
            });
    }
}
