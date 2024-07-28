import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntil } from 'rxjs';

import { POSTER_SIZE } from '../../../../core/enumerations/poster-size.enum';
import { Movie } from '../../../../core/models/movies/movie.model';
import { Person } from '../../../../core/models/people/person.model';
import { Media } from '../../../../core/models/shared/media.model';
import { TvSeries } from '../../../../core/models/tv-series/tv-series.model';
import { DEFAULT } from '../../../../shared/constants/defaults.constant';
import { PosterPathDirective } from '../../../../shared/directives/poster-path.directive';
import { PeopleFacade } from '../../../../shared/facades/people.facade';
import { BaseComponent } from '../../../../shared/helpers/base.component';

@Component({
    selector: 'app-movies',
    standalone: true,
    providers: [],
    templateUrl: './popular.component.html',
    styleUrl: './popular.component.scss',
    imports: [CommonModule, PosterPathDirective, RouterLink],
})
export class PeoplePopularComponent extends BaseComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.smallPosterSize;
    public posterFallback = DEFAULT.smallPosterFallback;
    public popularPeople: Array<Person> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;

    constructor(private peopleFacade: PeopleFacade) {
        super();
    }

    ngOnInit(): void {
        this.getPopularPeople();
    }

    public onLoadMore(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.getPopularPeople(true);
        }
    }

    public isMovie(item: Media | Movie | TvSeries): item is Movie {
        return (item as Movie).title !== undefined;
    }

    private getPopularPeople(loadMore: boolean = false): void {
        this.peopleFacade
            .getPopular(this.currentPage)
            .pipe(takeUntil(this.destroyed))
            .subscribe((popularPeople) => {
                if (loadMore) {
                    this.popularPeople = [...this.popularPeople, ...popularPeople.results];
                } else {
                    this.popularPeople = popularPeople.results;
                }

                this.currentPage = +popularPeople.page;
                this.totalPages = +popularPeople.total_pages;
            });
    }
}
