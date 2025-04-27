// tv-shows.component.ts
import { CommonModule } from '@angular/common';
import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { AbstractGenreLoaderComponent } from '../../shared/abstract/genre-loader.abstract';
import { CarouselMediaComponent } from '../../shared/components/carousel-media/carousel-media.component';
import { FeaturedBannerComponent } from '../../shared/components/featured-banner/featured-banner.component';
import { InfiniteScrollLoaderComponent } from '../../shared/components/infinite-scroll-loader/infinite-scroll-loader.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { MEDIA_TYPE } from '../../shared/enumerations/media-type.enum';
import { TvShowFacade } from '../../shared/facades/tv-show.facade';
import { filterMediaItems } from '../../shared/helpers/filter-items.helper';
import { PaginatedTvShows, TvShow } from '../../shared/models/tv-show.model';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Component({
    selector: 'app-tv-shows',
    standalone: true,
    templateUrl: './tv-shows.component.html',
    styleUrl: './tv-shows.component.scss',
    imports: [
        CommonModule,
        SectionHeaderComponent,
        CarouselMediaComponent,
        InfiniteScrollLoaderComponent,
        FeaturedBannerComponent,
    ],
})
export class TvShowsComponent extends AbstractGenreLoaderComponent<TvShow> {
    readonly mediaType = MEDIA_TYPE;
    airingToday: Array<TvShow> = [];
    popular: Array<TvShow> = [];
    topRated: Array<TvShow> = [];
    isMainContentLoading = false;

    protected override type = MEDIA_TYPE.TvShow;
    protected override genreStorageKey = 'tvShowGenres';

    constructor(
        private tvShowFacade: TvShowFacade,
        destroyRef: DestroyRef,
        localStorageService: LocalStorageService,
    ) {
        super(destroyRef, localStorageService);
    }

    protected override loadInitialContent(): void {
        this.isMainContentLoading = true;
        this.tvShowFacade
            .getAllTvShows()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((allTvShows) => {
                this.airingToday = filterMediaItems(allTvShows.airingToday.results) as Array<TvShow>;
                this.popular = filterMediaItems(allTvShows.popular.results) as Array<TvShow>;
                this.topRated = filterMediaItems(allTvShows.topRated.results) as Array<TvShow>;
                this.isMainContentLoading = false;
            });
    }

    protected override getItemsByGenreIds(
        currentGenreIndex: number,
        genresPerBatch: number,
    ): Observable<Record<string, PaginatedTvShows>> {
        return this.tvShowFacade.getTvShowsByGenreIds(currentGenreIndex, genresPerBatch);
    }
}
