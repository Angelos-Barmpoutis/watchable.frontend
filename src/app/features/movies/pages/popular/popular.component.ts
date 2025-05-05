import { CommonModule } from '@angular/common';
import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';

import { BaseMediaListItemComponent } from '../../../../shared/abstract/base-media-list-item.abstract';
import { InfiniteScrollLoaderComponent } from '../../../../shared/components/infinite-scroll-loader/infinite-scroll-loader.component';
import { MediaListItemComponent } from '../../../../shared/components/media-list-item/media-list-item.component';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { MediaType } from '../../../../shared/enumerations/media-type.enum';
import { MovieFacade } from '../../../../shared/facades/movie.facade';
import { mapMoviesWithGenres } from '../../../../shared/helpers/genres.helper';
import { Genre } from '../../../../shared/models/genre.model';
import { Movie, MovieItem } from '../../../../shared/models/movie.model';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';

@Component({
    selector: 'app-popular-movies',
    standalone: true,
    providers: [],
    templateUrl: './popular.component.html',
    styleUrl: './popular.component.scss',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SectionHeaderComponent,
        MediaListItemComponent,
        InfiniteScrollLoaderComponent,
    ],
})
export class PopularMoviesComponent extends BaseMediaListItemComponent<MovieItem> {
    override items: Array<MovieItem> = [];
    mediaType = MediaType;
    constructor(
        private movieFacade: MovieFacade,
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
        this.movieFacade
            .getPopular(this.currentPage)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({ results, page, total_pages }) => {
                const moviesWithGenres = this.mapItemsWithGenres(results, this.genres);
                this.items = [...this.items, ...moviesWithGenres];
                this.currentPage = page;
                this.totalPages = total_pages;
                this.isLoading = false;
            });
    }
}
