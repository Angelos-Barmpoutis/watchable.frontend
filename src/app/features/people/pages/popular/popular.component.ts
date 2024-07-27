import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntil } from 'rxjs';

import { PROFILE_SIZE } from '../../../../core/enumerations/profile-size.enum';
import { Movie } from '../../../../core/models/movies/movie.model';
import { Person } from '../../../../core/models/people/person.model';
import { Media } from '../../../../core/models/shared/media.model';
import { TvSeries } from '../../../../core/models/tv-series/tv-series.model';
import { ProfilePathDirective } from '../../../../shared/directives/profile-path.directive';
import { PeopleFacade } from '../../../../shared/facades/people.facade';
import { BaseComponent } from '../../../../shared/helpers/base.component';
import { LimitToPipe } from '../../../../shared/pipes/limit-to.pipe';

@Component({
    selector: 'app-movies',
    standalone: true,
    providers: [],
    templateUrl: './popular.component.html',
    styleUrl: './popular.component.scss',
    imports: [CommonModule, ProfilePathDirective, LimitToPipe, RouterLink],
})
export class PeoplePopularComponent extends BaseComponent implements OnInit {
    public profileSize: PROFILE_SIZE = PROFILE_SIZE.w185;
    public popularPeople!: Array<Person>;

    constructor(private peopleFacade: PeopleFacade) {
        super();
    }

    ngOnInit(): void {
        this.getPopularPeople();
    }

    public isMovie(item: Media | Movie | TvSeries): item is Movie {
        return (item as Movie).title !== undefined;
    }

    private getPopularPeople(): void {
        this.peopleFacade
            .getPopular()
            .pipe(takeUntil(this.destroyed))
            .subscribe((popularPeople) => {
                this.popularPeople = popularPeople.results;
            });
    }
}
