import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CarouselPersonComponent } from '../../shared/components/carousel-person/carousel-person.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { PeopleFacade } from '../../shared/facades/people.facade';
import { filterPersonItems } from '../../shared/helpers/filter-items.helper';
import { Person } from '../../shared/models/people.model';

@Component({
    selector: 'app-people',
    standalone: true,
    providers: [],
    templateUrl: './people.component.html',
    styleUrl: './people.component.scss',
    imports: [CommonModule, SectionHeaderComponent, CarouselPersonComponent],
})
export class PeopleComponent implements OnInit {
    people: Array<Person> = [];
    isLoading = false;

    constructor(
        private peopleFacade: PeopleFacade,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.getItems();
    }

    trackByItemId(index: number, person: Person): number {
        return person.id;
    }

    getItems(): void {
        this.isLoading = true;
        this.peopleFacade
            .getPopular()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({ results }) => {
                this.people = filterPersonItems(results);
                this.isLoading = false;
            });
    }
}
