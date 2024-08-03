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
    selector: 'app-popular-movies',
    standalone: true,
    providers: [],
    templateUrl: './popular.component.html',
    styleUrl: './popular.component.scss',
    imports: [CommonModule, PosterPathDirective, RouterLink],
})
export class MoviesPopularComponent extends BaseComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.smallPosterSize;
    public posterFallback = DEFAULT.smallPosterFallback;
    public popularMovies: Array<Movie> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;

    constructor(private movieFacade: MoviesFacade) {
        super();
    }

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
            .pipe(takeUntil(this.destroyed))
            .subscribe((popularMovies) => {
                if (loadMore) {
                    this.popularMovies = [...this.popularMovies, ...popularMovies.results];
                } else {
                    this.popularMovies = popularMovies.results;
                }

                this.currentPage = +popularMovies.page;
                this.totalPages = +popularMovies.total_pages;
            });
    }
}
