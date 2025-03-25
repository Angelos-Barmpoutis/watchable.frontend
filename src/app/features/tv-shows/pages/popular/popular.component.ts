import { CommonModule } from '@angular/common';
import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';

import { BaseMediaListItemComponent } from '../../../../shared/abstract/base-media-list-item.abstract';
import { InfiniteScrollLoaderComponent } from '../../../../shared/components/infinite-scroll-loader/infinite-scroll-loader.component';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { TvShowListItemComponent } from '../../../../shared/components/tv-show-list-item/tv-show-list-item.component';
import { TvShowFacade } from '../../../../shared/facades/tv-show.facade';
import { mapTvShowsWithGenres } from '../../../../shared/helpers/map-items-with-genres.helper';
import { Genre } from '../../../../shared/models/genre.model';
import { TvShow, TvShowItem } from '../../../../shared/models/tv-show.model';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';

@Component({
    selector: 'app-popular-tv-shows',
    standalone: true,
    providers: [],
    templateUrl: './popular.component.html',
    styleUrl: './popular.component.scss',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SectionHeaderComponent,
        TvShowListItemComponent,
        InfiniteScrollLoaderComponent,
    ],
})
export class PopularTvShowsComponent extends BaseMediaListItemComponent<TvShowItem> {
    override items: Array<TvShowItem> = [];

    constructor(
        private tvShowFacade: TvShowFacade,
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
        this.tvShowFacade
            .getPopular(this.currentPage)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({ results, page, total_pages }) => {
                const tvShowsWithGenres = this.mapItemsWithGenres(results, this.genres);
                this.items = [...this.items, ...tvShowsWithGenres];
                this.currentPage = page;
                this.totalPages = total_pages;
                this.isLoading = false;
            });
    }
}
