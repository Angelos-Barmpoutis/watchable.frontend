import { CommonModule } from '@angular/common';
import { Component, DestroyRef, ElementRef, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';

import { BaseMediaListItemComponent } from '../../shared/abstract/base-media-list-item.abstract';
import { InfiniteScrollLoaderComponent } from '../../shared/components/infinite-scroll-loader/infinite-scroll-loader.component';
import { MediaListItemComponent } from '../../shared/components/media-list-item/media-list-item.component';
import { PersonListItemComponent } from '../../shared/components/person-list-item/person-list-item.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { TabItem, TabsComponent } from '../../shared/components/tabs/tabs.component';
import { DEFAULT } from '../../shared/constants/defaults.constant';
import { MediaType } from '../../shared/enumerations/media-type.enum';
import { SearchOption } from '../../shared/enumerations/search-option.enum';
import { SearchFacade } from '../../shared/facades/search.facade';
import { mapMoviesWithGenres, mapTvShowsWithGenres } from '../../shared/helpers/genres.helper';
import { Genre } from '../../shared/models/genre.model';
import { MovieItem } from '../../shared/models/movie.model';
import { Person } from '../../shared/models/people.model';
import { TvShowItem } from '../../shared/models/tv-show.model';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { SearchService } from '../../shared/services/search.service';

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MediaListItemComponent,
        PersonListItemComponent,
        InfiniteScrollLoaderComponent,
        TabsComponent,
        SectionHeaderComponent,
    ],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
})
export class SearchComponent extends BaseMediaListItemComponent<MovieItem | TvShowItem | Person> implements OnInit {
    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
    readonly searchOption = SearchOption;
    searchForm!: FormGroup;
    searchQuery: string = '';
    searchMovies: Array<MovieItem> = [];
    searchTvShows: Array<TvShowItem> = [];
    searchPeople: Array<Person> = [];
    movieGenres: Array<Genre> = [];
    tvShowGenres: Array<Genre> = [];
    override currentPage: number = 1;
    override totalPages: number = 1;
    override isLoading: boolean = false;
    option: SearchOption = SearchOption.Movie;
    searchTabs: Array<TabItem<SearchOption>> = [
        { id: 0, label: 'Movies', value: SearchOption.Movie },
        { id: 1, label: 'TV Shows', value: SearchOption.Tv },
        { id: 2, label: 'People', value: SearchOption.Person },
    ];

    mediaType = MediaType;

    constructor(
        private searchFacade: SearchFacade,
        private formBuilder: FormBuilder,
        private localStorageService: LocalStorageService,
        private searchService: SearchService,
        destroyRef: DestroyRef,
    ) {
        super(destroyRef);
    }

    override ngOnInit(): void {
        this.initForm();
        this.getGenres();
        this.listenForUrlParameterers();
    }

    private initForm(): void {
        this.searchForm = this.formBuilder.group({
            searchQuery: ['', Validators.required],
        });
    }

    private listenForUrlParameterers(): void {
        this.searchService
            .getSearchQuery()
            .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
            .subscribe((query: string) => {
                if (query) {
                    this.searchQuery = query;
                    this.changeSearchOption(this.option);
                }
            });
    }

    private getMovies(): void {
        this.isLoading = true;
        this.searchFacade
            .getMovies(this.searchQuery, this.currentPage)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((paginatedMovies) => {
                const moviesWithGenres = this.mapItemsWithGenres(
                    paginatedMovies.results as Array<MovieItem>,
                    this.movieGenres,
                ) as Array<MovieItem>;
                this.searchMovies = [...this.searchMovies, ...moviesWithGenres];
                this.currentPage = paginatedMovies.page;
                this.totalPages = paginatedMovies.total_pages;
                this.isLoading = false;
            });
    }

    private getTvShows(): void {
        this.isLoading = true;
        this.searchFacade
            .getTvShows(this.searchQuery, this.currentPage)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((paginatedTvShows) => {
                const tvShowsWithGenres = this.mapItemsWithGenres(
                    paginatedTvShows.results as Array<TvShowItem>,
                    this.tvShowGenres,
                ) as Array<TvShowItem>;
                this.searchTvShows = [...this.searchTvShows, ...tvShowsWithGenres];
                this.currentPage = paginatedTvShows.page;
                this.totalPages = paginatedTvShows.total_pages;
                this.isLoading = false;
            });
    }

    private getPeople(): void {
        this.isLoading = true;
        this.searchFacade
            .getPeople(this.searchQuery, this.currentPage)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((paginatedPeople) => {
                this.searchPeople = [...this.searchPeople, ...paginatedPeople.results];
                this.currentPage = paginatedPeople.page;
                this.totalPages = paginatedPeople.total_pages;
                this.isLoading = false;
            });
    }

    changeSearchOption(searchOption: SearchOption): void {
        this.currentPage = DEFAULT.page;
        this.totalPages = DEFAULT.totalPages;
        this.option = searchOption;
        this.searchMovies = [];
        this.searchTvShows = [];
        this.searchPeople = [];
        this.getItems();
    }

    getItems(): void {
        switch (this.option) {
            case SearchOption.Movie:
                this.getMovies();
                break;
            case SearchOption.Tv:
                this.getTvShows();
                break;
            case SearchOption.Person:
                this.getPeople();
                break;
            default:
                this.getMovies();
                break;
        }
    }

    getGenres(): void {
        this.movieGenres = this.localStorageService.getItem<Array<Genre>>('movieGenres') ?? [];
        this.tvShowGenres = this.localStorageService.getItem<Array<Genre>>('tvShowGenres') ?? [];
    }

    trackByItemId(index: number, item: MovieItem | TvShowItem | Person): number {
        return item.id;
    }

    mapItemsWithGenres(
        items: Array<MovieItem | TvShowItem | Person>,
        genres: Array<Genre>,
    ): Array<MovieItem | TvShowItem | Person> {
        switch (this.option) {
            case SearchOption.Movie:
                return mapMoviesWithGenres(items as Array<MovieItem>, genres);
            case SearchOption.Tv:
                return mapTvShowsWithGenres(items as Array<TvShowItem>, genres);
            default:
                return items;
        }
    }
}
