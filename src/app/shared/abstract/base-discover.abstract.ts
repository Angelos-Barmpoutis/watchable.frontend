import { DestroyRef, Directive, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';

import { DEFAULT } from '../constants/defaults.constant';
import { Genre } from '../models/genre.model';
import { LocalStorageService } from '../services/local-storage.service';
import { BaseListItemComponent } from './base-list-item.abstract';

@Directive()
export abstract class BaseDiscoverComponent<T> extends BaseListItemComponent<T> implements OnInit {
    genreName: string = '';
    genreId: number = 0;
    genres: Array<Genre> = [];

    protected abstract genreStorageKey: string;

    constructor(
        protected route: ActivatedRoute,
        protected localStorageService: LocalStorageService,
        protected destroyRef: DestroyRef,
    ) {
        super();
    }

    ngOnInit(): void {
        this.loadGenres();
        this.initializeRouteListener();
    }

    private initializeRouteListener(): void {
        this.route.params
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                tap((params: { [key: string]: string }) => {
                    this.reset();
                    this.genreName = params['genre'];
                    this.findGenreId();
                }),
            )
            .subscribe(() => {
                this.getItems();
            });
    }

    private reset(): void {
        this.currentPage = DEFAULT.page;
        this.items = [];
    }

    private loadGenres(): void {
        this.genres = this.localStorageService.getItem<Array<Genre>>(this.genreStorageKey) ?? [];
    }

    private findGenreId(): void {
        const foundGenre = this.genres.find((g) => g.name === this.genreName);
        this.genreId = foundGenre?.id || 0;
    }
}
