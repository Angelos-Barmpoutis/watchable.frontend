import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, DestroyRef, HostListener, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { debounceTime, filter } from 'rxjs';

import { DEFAULT } from '../../constants/defaults.constant';
import { PosterPathDirective } from '../../directives/poster-path.directive';
import { ProfilePathDirective } from '../../directives/profile-path.directive';
import { POSTER_SIZE } from '../../enumerations/poster-size.enum';
import { PROFILE_SIZE } from '../../enumerations/profile-size.enum';
import { SEARCH_FILTER } from '../../enumerations/search-filter.enum';
import { SearchFacade } from '../../facades/search.facade';
import { Movie } from '../../models/movies/movie.model';
import { Person } from '../../models/people/person.model';
import { KnownForItem } from '../../models/shared/known-for-item.model';
import { SearchItem } from '../../models/shared/search-item.model';
import { TvSeries } from '../../models/tv-series/tv-series.model';

@Component({
    selector: 'app-search-bar',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, TitleCasePipe, PosterPathDirective, ProfilePathDirective],
    templateUrl: './search-bar.component.html',
    styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit {
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
    public get searchFilterFormField(): FormControl {
        return this.searchForm.get('searchFilter') as FormControl;
    }

    public get searchQueryFormField(): FormControl {
        return this.searchForm.get('searchQuery') as FormControl;
    }

    constructor(
        private formBuilder: FormBuilder,
        private searchFacade: SearchFacade,
        private router: Router,
        private destroyRef: DestroyRef,
    ) {}

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
                takeUntilDestroyed(this.destroyRef),
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
            .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
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
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe((paginatedSearchItems) => {
                        const searchItems = paginatedSearchItems.results.slice(0, DEFAULT.searchItemsCount);
                        this.searchMultiItems = searchItems;
                    });
                break;
            case SEARCH_FILTER.Movie:
                this.searchFacade
                    .getMovies(this.searchQueryFormField.value as string)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe((paginatedSearchItems) => {
                        const searchItems = paginatedSearchItems.results.slice(0, DEFAULT.searchItemsCount);
                        this.searchMovieItems = searchItems;
                    });
                break;
            case SEARCH_FILTER.Tv:
                this.searchFacade
                    .getTvSeries(this.searchQueryFormField.value as string)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe((paginatedSearchItems) => {
                        const searchItems = paginatedSearchItems.results.slice(0, DEFAULT.searchItemsCount);
                        this.searchTvSeriesItems = searchItems;
                    });
                break;
            case SEARCH_FILTER.Person:
                this.searchFacade
                    .getPeople(this.searchQueryFormField.value as string)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe((paginatedSearchItems) => {
                        const searchItems = paginatedSearchItems.results.slice(0, DEFAULT.searchItemsCount);
                        this.searchPeopleItems = searchItems;
                    });
                break;
        }
    }
}
