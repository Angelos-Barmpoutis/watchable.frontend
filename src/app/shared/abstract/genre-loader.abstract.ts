// Create a new file: shared/components/abstract-genre-loader.component.ts

import { DestroyRef, Directive, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { DEFAULT } from '../constants/defaults.constant';
import { MediaType } from '../enumerations/media-type.enum';
import { filterMediaItems } from '../helpers/filter-items.helper';
import { Genre } from '../models/genre.model';
import { Movie } from '../models/movie.model';
import { TvShow } from '../models/tv-show.model';
import { LocalStorageService } from '../services/local-storage.service';

export interface GenreLoadedItems<T> {
    type: MediaType;
    genreName: string;
    genreId: number;
    items: Array<T>;
}

@Directive()
export abstract class AbstractGenreLoaderComponent<T> implements OnInit {
    protected currentGenreIndex = 0;
    protected genresPerBatch = DEFAULT.genresBatchSize;
    protected genres: Array<Genre> = [];
    protected isLoadingMoreGenres = false;
    protected allGenresLoaded = false;
    protected loadedGenres: Array<GenreLoadedItems<T>> = [];

    protected abstract type: MediaType;
    protected abstract genreStorageKey: string;

    constructor(
        protected destroyRef: DestroyRef,
        protected localStorageService: LocalStorageService,
    ) {}

    ngOnInit(): void {
        this.getStoredGenres();
        this.loadInitialContent();
    }

    protected getStoredGenres(): void {
        this.genres = this.localStorageService.getItem<Array<Genre>>(this.genreStorageKey) ?? [];
    }

    protected abstract loadInitialContent(): void;

    protected abstract getItemsByGenreIds(
        currentGenreIndex: number,
        genresPerBatch: number,
    ): Observable<Record<string, { results: Array<unknown> }>>;

    loadMore(): void {
        if (this.currentGenreIndex >= this.genres.length) {
            this.allGenresLoaded = true;
            return;
        }

        this.loadMoreGenres();
    }

    protected loadMoreGenres(): void {
        this.isLoadingMoreGenres = true;

        this.getItemsByGenreIds(this.currentGenreIndex, this.genresPerBatch)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((results) => {
                Object.entries(results).forEach(([key, value]) => {
                    const [type, genreName] = key.split('_');
                    const items = filterMediaItems(value.results as Array<Movie | TvShow>) as Array<T>;

                    if (items.length > 0) {
                        const genreId = this.genres.find((g) => g.name === genreName)?.id;

                        if (genreId) {
                            this.loadedGenres.push({
                                type: type as MediaType,
                                genreName,
                                genreId,
                                items: items,
                            });
                        }
                    }
                });

                this.currentGenreIndex += this.genresPerBatch;
                this.allGenresLoaded = this.currentGenreIndex >= this.genres.length;
                this.isLoadingMoreGenres = false;
            });
    }
}
