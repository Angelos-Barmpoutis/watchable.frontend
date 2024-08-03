import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { debounceTime, filter, takeUntil } from 'rxjs';

import { POSTER_SIZE } from '../../../core/enumerations/poster-size.enum';
import { PROFILE_SIZE } from '../../../core/enumerations/profile-size.enum';
import { SEARCH_FILTER } from '../../../core/enumerations/search-filter.enum';
import { Movie } from '../../../core/models/movies/movie.model';
import { Person } from '../../../core/models/people/person.model';
import { KnownForItem } from '../../../core/models/shared/known-for-item.model';
import { SearchItem } from '../../../core/models/shared/search-item.model';
import { TvSeries } from '../../../core/models/tv-series/tv-series.model';
import { DEFAULT } from '../../constants/defaults.constant';
import { PosterPathDirective } from '../../directives/poster-path.directive';
import { ProfilePathDirective } from '../../directives/profile-path.directive';
import { SearchFacade } from '../../facades/search.facade';
import { BaseComponent } from '../../helpers/base.component';

@Component({
    selector: 'app-search-bar',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, TitleCasePipe, PosterPathDirective, ProfilePathDirective],
    templateUrl: './search-bar.component.html',
    styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent extends BaseComponent implements OnInit {
    @HostListener('document:click', ['$event'])
    onDocumentClick(): void {
        this.isSearching = false;
    }

    public posterSize: POSTER_SIZE = DEFAULT.smallPosterSize;
    public posterFallback = DEFAULT.smallPosterFallback;
    public profileSize: PROFILE_SIZE = DEFAULT.smallProfileSize;
    public profileFallback = DEFAULT.smallProfileFallback;
    public searchForm!: FormGroup;
    public SEARCH_FILTER = SEARCH_FILTER;
    public isSearching = false;
    public searchMultiItems: Array<SearchItem> = [];
    public searchMovieItems: Array<Movie> = [];
    public searchTvSeriesItems: Array<TvSeries> = [];
    public searchPeopleItems: Array<Person> = [];
    public searchString = '';

    constructor(
        private formBuilder: FormBuilder,
        private searchFacade: SearchFacade,
        private router: Router,
    ) {
        super();
    }

    ngOnInit(): void {
        this.initSearchForm();
        this.listenForSearchFormChanges();
        this.listenForRouteChanges();
    }

    public isMovie(item: KnownForItem): boolean {
        return item.media_type === 'movie';
    }

    private listenForRouteChanges(): void {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this.destroyed),
            )
            .subscribe(() => {
                this.searchForm.setValue({
                    searchFilter: DEFAULT.searchFilter,
                    searchQuery: '',
                });
            });
    }

    private initSearchForm(): void {
        this.searchForm = this.formBuilder.group({
            searchFilter: [DEFAULT.searchFilter, Validators.required],
            searchQuery: ['', Validators.required],
        });
    }

    private listenForSearchFormChanges(): void {
        this.searchForm.valueChanges
            .pipe(debounceTime(300), takeUntil(this.destroyed))
            .subscribe((form: { searchFilter: SEARCH_FILTER; searchQuery: string }) => {
                this.searchString = this.searchQueryFormField.value as string;

                if (form.searchQuery?.trim().length > 0) {
                    this.isSearching = true;
                    this.onSearchQueryFormFieldChanged();
                } else {
                    this.isSearching = false;
                }
            });
    }

    private onSearchQueryFormFieldChanged(): void {
        switch (this.searchFilterFormField.value) {
            case SEARCH_FILTER.Multi:
                this.searchFacade
                    .getMulti(this.searchQueryFormField.value as string)
                    .pipe(takeUntil(this.destroyed))
                    .subscribe((paginatedSearchItems) => {
                        const searchItems = paginatedSearchItems.results.slice(0, DEFAULT.searchItemsCount);
                        this.searchMultiItems = searchItems;
                    });
                break;
            case SEARCH_FILTER.Movie:
                this.searchFacade
                    .getMovies(this.searchQueryFormField.value as string)
                    .pipe(takeUntil(this.destroyed))
                    .subscribe((paginatedSearchItems) => {
                        const searchItems = paginatedSearchItems.results.slice(0, DEFAULT.searchItemsCount);
                        this.searchMovieItems = searchItems;
                    });
                break;
            case SEARCH_FILTER.Tv:
                this.searchFacade
                    .getTvSeries(this.searchQueryFormField.value as string)
                    .pipe(takeUntil(this.destroyed))
                    .subscribe((paginatedSearchItems) => {
                        const searchItems = paginatedSearchItems.results.slice(0, DEFAULT.searchItemsCount);
                        this.searchTvSeriesItems = searchItems;
                    });
                break;
            case SEARCH_FILTER.Person:
                this.searchFacade
                    .getPeople(this.searchQueryFormField.value as string)
                    .pipe(takeUntil(this.destroyed))
                    .subscribe((paginatedSearchItems) => {
                        const searchItems = paginatedSearchItems.results.slice(0, DEFAULT.searchItemsCount);
                        this.searchPeopleItems = searchItems;
                    });
                break;
        }
    }

    public get searchFilterFormField(): FormControl {
        return this.searchForm.get('searchFilter') as FormControl;
    }

    public get searchQueryFormField(): FormControl {
        return this.searchForm.get('searchQuery') as FormControl;
    }
}
