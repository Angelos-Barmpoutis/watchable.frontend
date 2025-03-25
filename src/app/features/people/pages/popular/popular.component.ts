import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';

import { BaseListItemComponent } from '../../../../shared/abstract/base-list-item.abstract';
import { InfiniteScrollLoaderComponent } from '../../../../shared/components/infinite-scroll-loader/infinite-scroll-loader.component';
import { PersonListItemComponent } from '../../../../shared/components/person-list-item/person-list-item.component';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { PeopleFacade } from '../../../../shared/facades/people.facade';
import { Person } from '../../../../shared/models/people.model';

@Component({
    selector: 'app-popular-people',
    standalone: true,
    providers: [],
    templateUrl: './popular.component.html',
    styleUrl: './popular.component.scss',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SectionHeaderComponent,
        PersonListItemComponent,
        InfiniteScrollLoaderComponent,
    ],
})
export class PeoplePopularComponent extends BaseListItemComponent<Person> implements OnInit {
    override items: Array<Person> = [];

    constructor(
        private peopleFacade: PeopleFacade,
        private destroyRef: DestroyRef,
    ) {
        super();
    }

    ngOnInit(): void {
        this.getItems();
    }

    trackByItemId(index: number, item: Person): number {
        return item.id;
    }

    getItems(): void {
        this.peopleFacade
            .getPopular(this.currentPage)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({ results, page, total_pages }) => {
                this.items = [...this.items, ...results];
                this.currentPage = page;
                this.totalPages = total_pages;
                this.isLoading = false;
            });
    }
}
