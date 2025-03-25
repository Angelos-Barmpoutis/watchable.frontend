import { DestroyRef, Directive, OnInit } from '@angular/core';

import { Genre } from '../models/genre.model';
import { BaseListItemComponent } from './base-list-item.abstract';

@Directive()
export abstract class BaseMediaListItemComponent<T> extends BaseListItemComponent<T> implements OnInit {
    genres: Array<Genre> = [];

    protected constructor(protected destroyRef: DestroyRef) {
        super();
    }

    ngOnInit(): void {
        this.getGenres();
        this.getItems();
    }

    protected abstract getGenres(): void;
    protected abstract mapItemsWithGenres(items: Array<unknown>, genres: Array<Genre>): Array<T>;
}
