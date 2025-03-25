import { CommonModule } from '@angular/common';
import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';

import { BaseMediaListItemComponent } from '../../../../shared/abstract/base-media-list-item.abstract';
import { InfiniteScrollLoaderComponent } from '../../../../shared/components/infinite-scroll-loader/infinite-scroll-loader.component';
import { MovieListItemComponent } from '../../../../shared/components/movie-list-item/movie-list-item.component';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { MovieFacade } from '../../../../shared/facades/movie.facade';
import { mapMoviesWithGenres } from '../../../../shared/helpers/map-items-with-genres.helper';
import { Genre } from '../../../../shared/models/genre.model';
import { Movie, MovieItem } from '../../../../shared/models/movie.model';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';

@Component({
    selector: 'app-now-playing-movies',
    standalone: true,
    providers: [],
    templateUrl: './now-playing.component.html',
    styleUrl: './now-playing.component.scss',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SectionHeaderComponent,
        MovieListItemComponent,
        InfiniteScrollLoaderComponent,
    ],
})
export class NowPlayingMoviesComponent extends BaseMediaListItemComponent<MovieItem> {
    override items: Array<MovieItem> = [];

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
            .getNowPlaying(this.currentPage)
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
