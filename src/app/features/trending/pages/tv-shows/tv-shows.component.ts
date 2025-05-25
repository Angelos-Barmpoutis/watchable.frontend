import { CommonModule } from '@angular/common';
import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';

import { BaseMediaListItemComponent } from '../../../../shared/abstract/base-media-list-item.abstract';
import { InfiniteScrollLoaderComponent } from '../../../../shared/components/infinite-scroll-loader/infinite-scroll-loader.component';
import { MediaListItemComponent } from '../../../../shared/components/media-list-item/media-list-item.component';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { TabItem, TabsComponent } from '../../../../shared/components/tabs/tabs.component';
import { DEFAULT } from '../../../../shared/constants/defaults.constant';
import { MediaType } from '../../../../shared/enumerations/media-type.enum';
import { TimeOption } from '../../../../shared/enumerations/time-option.enum';
import { TrendingFacade } from '../../../../shared/facades/trending.facade';
import { mapTvShowsWithGenres } from '../../../../shared/helpers/genres.helper';
import { Genre } from '../../../../shared/models/genre.model';
import { TvShow, TvShowItem } from '../../../../shared/models/tv-show.model';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';

@Component({
    selector: 'app-trending-tv-shows',
    standalone: true,
    providers: [],
    templateUrl: './tv-shows.component.html',
    styleUrl: './tv-shows.component.scss',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SectionHeaderComponent,
        MediaListItemComponent,
        TabsComponent,
        InfiniteScrollLoaderComponent,
    ],
})
export class TrendingTvShowsComponent extends BaseMediaListItemComponent<TvShowItem> {
    override items: Array<TvShowItem> = [];
    timeOption = DEFAULT.timeOption;
    timeTabs: Array<TabItem<TimeOption>> = [
        { id: 0, value: TimeOption.Day, label: 'Today' },
        { id: 1, value: TimeOption.Week, label: 'This Week' },
    ];

    mediaType = MediaType;

    constructor(
        private trendingFacade: TrendingFacade,
        private localStorageService: LocalStorageService,
        destroyRef: DestroyRef,
    ) {
        super(destroyRef);
    }

    trackByItemId(index: number, item: TvShowItem): number {
        return item.id;
    }

    mapItemsWithGenres(items: Array<TvShow>, genres: Array<Genre>): Array<TvShowItem> {
        return mapTvShowsWithGenres(items, genres);
    }

    getGenres(): void {
        const storedTvShowGenres = this.localStorageService.getItem<Array<Genre>>('tvShowGenres') ?? [];
        this.genres = storedTvShowGenres;
    }

    getItems(): void {
        this.isLoading = true;
        this.trendingFacade
            .getTvShows(this.timeOption, this.currentPage)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({ results, page, total_pages }) => {
                const tvShowsWithGenres = this.mapItemsWithGenres(results, this.genres);
                this.items = [...this.items, ...tvShowsWithGenres];
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
