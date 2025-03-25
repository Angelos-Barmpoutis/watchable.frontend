// src/app/features/discover/movie-discover/movie-discover.component.ts
import { CommonModule } from '@angular/common';
import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { BaseDiscoverComponent } from '../../../../shared/abstract/base-discover.abstract';
import { InfiniteScrollLoaderComponent } from '../../../../shared/components/infinite-scroll-loader/infinite-scroll-loader.component';
import { MovieListItemComponent } from '../../../../shared/components/movie-list-item/movie-list-item.component';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { MovieFacade } from '../../../../shared/facades/movie.facade';
import { mapMoviesWithGenres } from '../../../../shared/helpers/map-items-with-genres.helper';
import { MovieItem } from '../../../../shared/models/movie.model';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';

@Component({
    selector: 'app-discover-movies',
    standalone: true,
    templateUrl: './discover.component.html',
    styleUrl: './discover.component.scss',
    imports: [CommonModule, SectionHeaderComponent, MovieListItemComponent, InfiniteScrollLoaderComponent],
})
export class DiscoverMoviesComponent extends BaseDiscoverComponent<MovieItem> {
    protected override genreStorageKey = 'movieGenres';

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
