// src/app/features/discover/movie-discover/movie-discover.component.ts
import { CommonModule } from '@angular/common';
import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { BaseDiscoverComponent } from '../../../../shared/abstract/base-discover.abstract';
import { InfiniteScrollLoaderComponent } from '../../../../shared/components/infinite-scroll-loader/infinite-scroll-loader.component';
import { MediaListItemComponent } from '../../../../shared/components/media-list-item/media-list-item.component';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { MediaType } from '../../../../shared/enumerations/media-type.enum';
import { MovieFacade } from '../../../../shared/facades/movie.facade';
import { mapMoviesWithGenres } from '../../../../shared/helpers/genres.helper';
import { MovieItem } from '../../../../shared/models/movie.model';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';

@Component({
    standalone: true,
    selector: 'app-discover-movies',
    templateUrl: './discover.component.html',
    styleUrl: './discover.component.scss',
    imports: [CommonModule, SectionHeaderComponent, MediaListItemComponent, InfiniteScrollLoaderComponent]
})
export class DiscoverMoviesComponent extends BaseDiscoverComponent<MovieItem> {
    protected override genreStorageKey = 'movieGenres';
    mediaType = MediaType;
    constructor(
        private movieFacade: MovieFacade,
        route: ActivatedRoute,
        localStorageService: LocalStorageService,
        destroyRef: DestroyRef,
    ) {
        super(route, localStorageService, destroyRef);
    }

    trackByItemId(index: number, item: MovieItem): number {
        return item.id;
    }

    getItems(): void {
        this.isLoading = true;
        this.movieFacade
            .getMovies(this.currentPage, this.genreId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({ results, page, total_pages }) => {
                const moviesWithGenres = mapMoviesWithGenres(results, this.genres);
                this.items = [...this.items, ...moviesWithGenres];
                this.currentPage = page;
                this.totalPages = total_pages;
                this.isLoading = false;
            });
    }
}
