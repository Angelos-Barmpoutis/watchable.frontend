import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../../../shared/constants/defaults.constant';
import { PosterPathDirective } from '../../../../shared/directives/poster-path.directive';
import { POSTER_SIZE } from '../../../../shared/enumerations/poster-size.enum';
import { TRENDING_FILTER } from '../../../../shared/enumerations/trending-filter.enum';
import { MoviesFacade } from '../../../../shared/facades/movies.facade';
import { TrendingFacade } from '../../../../shared/facades/trending.facade';
import { Movie } from '../../../../shared/models/movies/movie.model';

@Component({
    selector: 'app-trending-movies',
    standalone: true,
    providers: [],
    templateUrl: './movies.component.html',
    styleUrl: './movies.component.scss',
    imports: [CommonModule, ReactiveFormsModule, PosterPathDirective, RouterLink],
})
export class TrendingMoviesComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.smallPosterSize;
    public posterFallback = DEFAULT.smallPosterFallback;
    public TRENDING_FILTER = TRENDING_FILTER;
    public trendingMoviesForm!: FormGroup;
    public trendingMovies: Array<Movie> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;
    private get trendingMoviesFilterFormField(): FormControl {
        return this.trendingMoviesForm.get('moviesFilter') as FormControl;
    }

    constructor(
        private trendingFacade: TrendingFacade,
        private moviesFacade: MoviesFacade,
        private formBuilder: FormBuilder,
        private destroyRef: DestroyRef,
    ) {}

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

    public getDetails(id: number): void {
        this.moviesFacade
            .getDetails(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((details) => console.log(details));
    }

    private getTrendingMovies(loadMore: boolean = false): void {
        const trendingFilter: TRENDING_FILTER =
            (this.trendingMoviesFilterFormField?.value as TRENDING_FILTER) ?? DEFAULT.trendingFilter;

        this.trendingFacade
            .getTrendingMovies(trendingFilter, this.currentPage)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((trendingMovies) => {
                if (loadMore) {
                    this.trendingMovies = [...this.trendingMovies, ...trendingMovies.results];
                } else {
                    this.trendingMovies = trendingMovies.results;
                }

                this.currentPage = trendingMovies.page;
                this.totalPages = trendingMovies.total_pages;
            });
    }

    private initTrendingForm(): void {
        this.trendingMoviesForm = this.formBuilder.group({
            moviesFilter: DEFAULT.trendingFilter,
        });
    }

    private onTrendingFilterChanges(): void {
        this.trendingMoviesFilterFormField.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.currentPage = DEFAULT.page;
            this.getTrendingMovies();
        });
    }
}
