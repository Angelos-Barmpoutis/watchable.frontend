import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BaseCarouselComponent } from '../../abstract/base-carousel.abstract';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { Person } from '../../models/people.model';
import { CarouselPersonItemComponent } from '../carousel-person-item/carousel-person-item.component';

@Component({
    standalone: true,
    selector: 'app-carousel-person',
    imports: [CommonModule, CarouselPersonItemComponent, FadeInDirective],
    templateUrl: './carousel-person.component.html',
    styleUrl: './carousel-person.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselPersonComponent extends BaseCarouselComponent<Person> {
    constructor() {
        super();
    }

    trackByItemId(index: number, item: Person): number {
        return item.id;
    }
}
