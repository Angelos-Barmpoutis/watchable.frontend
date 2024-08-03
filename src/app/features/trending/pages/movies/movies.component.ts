import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntil } from 'rxjs';

import { POSTER_SIZE } from '../../../../core/enumerations/poster-size.enum';
import { TRENDING_FILTER } from '../../../../core/enumerations/trending-filter.enum';
import { Movie } from '../../../../core/models/movies/movie.model';
import { DEFAULT } from '../../../../shared/constants/defaults.constant';
import { PosterPathDirective } from '../../../../shared/directives/poster-path.directive';
import { TrendingFacade } from '../../../../shared/facades/trending.facade';
import { BaseComponent } from '../../../../shared/helpers/base.component';

@Component({
    selector: 'app-trending-movies',
    standalone: true,
    providers: [],
    templateUrl: './movies.component.html',
    styleUrl: './movies.component.scss',
    imports: [CommonModule, ReactiveFormsModule, PosterPathDirective, RouterLink],
})
export class TrendingMoviesComponent extends BaseComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.smallPosterSize;
    public posterFallback = DEFAULT.smallPosterFallback;
    public TRENDING_FILTER = TRENDING_FILTER;
    public trendingMoviesForm!: FormGroup;
    public trendingMovies: Array<Movie> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;

    constructor(
        private trendingFacade: TrendingFacade,
        private formBuilder: FormBuilder,
    ) {
        super();
    }

    ngOnInit(): void {
        this.initTrendingForm();
        this.getTrendingMovies();
        this.onTrendingFilterChanges();
    }

    public onLoadMore(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.getTrendingMovies(true);
        }
    }

    private getTrendingMovies(loadMore: boolean = false): void {
        const trendingFilter: TRENDING_FILTER =
            (this.trendingMoviesFilterFormField?.value as TRENDING_FILTER) ?? DEFAULT.trendingFilter;

        this.trendingFacade
            .getTrendingMovies(trendingFilter, this.currentPage)
            .pipe(takeUntil(this.destroyed))
            .subscribe((trendingMovies) => {
                if (loadMore) {
                    this.trendingMovies = [...this.trendingMovies, ...trendingMovies.results];
                } else {
                    this.trendingMovies = trendingMovies.results;
                }

                this.currentPage = +trendingMovies.page;
                this.totalPages = +trendingMovies.total_pages;
            });
    }

    private initTrendingForm(): void {
        this.trendingMoviesForm = this.formBuilder.group({
            moviesFilter: DEFAULT.trendingFilter,
        });
    }

    private onTrendingFilterChanges(): void {
        this.trendingMoviesFilterFormField.valueChanges.pipe(takeUntil(this.destroyed)).subscribe(() => {
            this.currentPage = DEFAULT.page;
            this.getTrendingMovies();
        });
    }

    private get trendingMoviesFilterFormField(): FormControl {
        return this.trendingMoviesForm.get('moviesFilter') as FormControl;
    }
}
