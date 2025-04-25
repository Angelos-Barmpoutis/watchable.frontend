import { CommonModule } from '@angular/common';
import { Component, DestroyRef, ElementRef, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { BaseMediaListItemComponent } from '../../shared/abstract/base-media-list-item.abstract';
import { InfiniteScrollLoaderComponent } from '../../shared/components/infinite-scroll-loader/infinite-scroll-loader.component';
import { MovieListItemComponent } from '../../shared/components/movie-list-item/movie-list-item.component';
import { PersonListItemComponent } from '../../shared/components/person-list-item/person-list-item.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { TabItem, TabsComponent } from '../../shared/components/tabs/tabs.component';
import { TvShowListItemComponent } from '../../shared/components/tv-show-list-item/tv-show-list-item.component';
import { DEFAULT } from '../../shared/constants/defaults.constant';
import { SEARCH_OPTION } from '../../shared/enumerations/search-option.enum';
import { SearchFacade } from '../../shared/facades/search.facade';
import { mapMoviesWithGenres, mapTvShowsWithGenres } from '../../shared/helpers/genres.helper';
import { Genre } from '../../shared/models/genre.model';
import { Movie, MovieItem } from '../../shared/models/movie.model';
import { Person } from '../../shared/models/people.model';
import { TvShow, TvShowItem } from '../../shared/models/tv-show.model';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MovieListItemComponent,
        TvShowListItemComponent,
        PersonListItemComponent,
        InfiniteScrollLoaderComponent,
        TabsComponent,
        SectionHeaderComponent,
    ],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
})
export class SearchComponent extends BaseMediaListItemComponent<Movie | TvShow | Person> implements OnInit {
    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
    readonly SEARCH_OPTION = SEARCH_OPTION;
    private movieGenres: Array<Genre> = [];
    private tvShowGenres: Array<Genre> = [];
    searchMovies: Array<MovieItem> = [];
    searchTvShows: Array<TvShowItem> = [];
    searchPeople: Array<Person> = [];
    searchQuery: string = '';
    searchForm!: FormGroup;

    hasMoreResults = true;
    searchOption = DEFAULT.searchOption;
    searchTabs: Array<TabItem<SEARCH_OPTION>> = [
        { id: 0, label: 'Movies', value: SEARCH_OPTION.Movie },
        { id: 1, label: 'TV Shows', value: SEARCH_OPTION.Tv },
        { id: 2, label: 'People', value: SEARCH_OPTION.Person },
    ];

    constructor(
        private searchFacade: SearchFacade,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private localStorageService: LocalStorageService,
        private router: Router,
        destroyRef: DestroyRef,
    ) {
        super(destroyRef);
        this.searchForm = this.formBuilder.group({
            searchQuery: ['', Validators.required],
        });
    }

    override ngOnInit(): void {
        this.getGenres();
        this.listenForUrlParameterers();
    }

    override loadMore(): void {
        if (this.isLoading || this.currentPage >= this.totalPages) {
            return;
        }
        this.currentPage++;

        switch (this.searchOption) {
            case SEARCH_OPTION.Movie: {
                this.getMovies();
                break;
            }
            case SEARCH_OPTION.Tv: {
                this.getTvShows();
                break;
            }
            case SEARCH_OPTION.Person: {
                this.getPeople();
                break;
            }
        }
    }

    private listenForUrlParameterers(): void {
        this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: Params) => {
            const queryParam = params['q'] as string;

            if (queryParam && queryParam !== '') {
                this.searchQuery = queryParam;
                this.changeSearchOption(this.searchOption);
            } else {
                this.searchQuery = '';
                this.router.navigate(['/']);
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

    changeSearchOption(searchOption: SEARCH_OPTION): void {
        this.currentPage = DEFAULT.page;
        this.totalPages = DEFAULT.totalPages;
        this.searchOption = searchOption;
        this.searchMovies = [];
        this.searchTvShows = [];
        this.searchPeople = [];
        this.getItems();
    }

    getItems(): void {
        switch (this.searchOption) {
            case SEARCH_OPTION.Movie:
                this.getMovies();
                break;
            case SEARCH_OPTION.Tv:
                this.getTvShows();
                break;
            case SEARCH_OPTION.Person:
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

    trackByItemId(index: number, item: Movie | TvShow | Person): number {
        return item.id;
    }

    mapItemsWithGenres(
        items: Array<MovieItem | TvShowItem | Person>,
        genres: Array<Genre>,
    ): Array<Movie | TvShow | Person> {
        switch (this.searchOption) {
            case SEARCH_OPTION.Movie:
                return mapMoviesWithGenres(items as Array<MovieItem>, genres);
            case SEARCH_OPTION.Tv:
                return mapTvShowsWithGenres(items as Array<TvShowItem>, genres);
            default:
                return items;
        }
    }
}
