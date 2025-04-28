import { CommonModule } from '@angular/common';
import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';

import { BaseMediaListItemComponent } from '../../../../shared/abstract/base-media-list-item.abstract';
import { InfiniteScrollLoaderComponent } from '../../../../shared/components/infinite-scroll-loader/infinite-scroll-loader.component';
import { MovieListItemComponent } from '../../../../shared/components/movie-list-item/movie-list-item.component';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { TabItem, TabsComponent } from '../../../../shared/components/tabs/tabs.component';
import { DEFAULT } from '../../../../shared/constants/defaults.constant';
import { TimeOption } from '../../../../shared/enumerations/time-option.enum';
import { TrendingFacade } from '../../../../shared/facades/trending.facade';
import { mapMoviesWithGenres } from '../../../../shared/helpers/genres.helper';
import { Genre } from '../../../../shared/models/genre.model';
import { Movie, MovieItem } from '../../../../shared/models/movie.model';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';

@Component({
    selector: 'app-trending-movies',
    standalone: true,
    providers: [],
    templateUrl: './movies.component.html',
    styleUrl: './movies.component.scss',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SectionHeaderComponent,
        MovieListItemComponent,
        TabsComponent,
        InfiniteScrollLoaderComponent,
    ],
})
export class TrendingMoviesComponent extends BaseMediaListItemComponent<MovieItem> {
    override items: Array<MovieItem> = [];
    timeOption = DEFAULT.timeOption;
    timeTabs: Array<TabItem<TimeOption>> = [
        { id: 0, value: TimeOption.Day, label: 'Today' },
        { id: 1, value: TimeOption.Week, label: 'This Week' },
    ];

    constructor(
        private trendingFacade: TrendingFacade,
        private localStorageService: LocalStorageService,
        destroyRef: DestroyRef,
    ) {
        super(destroyRef);
    }

    trackByItemId(index: number, item: MovieItem): number {
        return item.id;
    }

    mapItemsWithGenres(items: Array<Movie>, genres: Array<Genre>): Array<MovieItem> {
        return mapMoviesWithGenres(items, genres);
    }

    getGenres(): void {
        const storedMovieGenres = this.localStorageService.getItem<Array<Genre>>('movieGenres') ?? [];
        this.genres = storedMovieGenres;
    }

    getItems(): void {
        this.isLoading = true;
        this.trendingFacade
            .getMovies(this.timeOption, this.currentPage)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({ results, page, total_pages }) => {
                const moviesWithGenres = this.mapItemsWithGenres(results, this.genres);
                this.items = [...this.items, ...moviesWithGenres];
                this.currentPage = page;
                this.totalPages = total_pages;
                this.isLoading = false;
            });
    }

    changeTimeOption(timeOption: TimeOption): void {
        this.timeOption = timeOption;
        this.currentPage = DEFAULT.page;
        this.totalPages = DEFAULT.totalPages;
        this.items = [];
        this.getItems();
    }
}
