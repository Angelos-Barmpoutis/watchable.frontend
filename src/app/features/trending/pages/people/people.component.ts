import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';

import { BaseListItemComponent } from '../../../../shared/abstract/base-list-item.abstract';
import { InfiniteScrollLoaderComponent } from '../../../../shared/components/infinite-scroll-loader/infinite-scroll-loader.component';
import { PersonListItemComponent } from '../../../../shared/components/person-list-item/person-list-item.component';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { TabItem, TabsComponent } from '../../../../shared/components/tabs/tabs.component';
import { DEFAULT } from '../../../../shared/constants/defaults.constant';
import { TIME_OPTION } from '../../../../shared/enumerations/time-option.enum';
import { TrendingFacade } from '../../../../shared/facades/trending.facade';
import { Person } from '../../../../shared/models/people.model';

@Component({
    selector: 'app-trending-people',
    standalone: true,
    providers: [],
    templateUrl: './people.component.html',
    styleUrl: './people.component.scss',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SectionHeaderComponent,
        PersonListItemComponent,
        InfiniteScrollLoaderComponent,
        TabsComponent,
    ],
})
export class TrendingPeopleComponent extends BaseListItemComponent<Person> implements OnInit {
    override items: Array<Person> = [];
    timeOption = DEFAULT.timeOption;
    timeTabs: Array<TabItem<TIME_OPTION>> = [
        { id: 0, value: TIME_OPTION.Day, label: 'Today' },
        { id: 1, value: TIME_OPTION.Week, label: 'This Week' },
    ];

    constructor(
        private trendingFacade: TrendingFacade,
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
        this.isLoading = true;
        this.trendingFacade
            .getPeople(this.timeOption, this.currentPage)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({ results, page, total_pages }) => {
                this.items = [...this.items, ...results];
                this.currentPage = page;
                this.totalPages = total_pages;
                this.isLoading = false;
            });
    }

    changeTimeOption(timeOption: TIME_OPTION): void {
        this.timeOption = timeOption;
        this.currentPage = DEFAULT.page;
        this.items = [];
        this.getItems();
    }
}
