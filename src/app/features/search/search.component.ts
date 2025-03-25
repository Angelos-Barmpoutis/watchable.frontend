import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params } from '@angular/router';

import { DEFAULT } from '../../shared/constants/defaults.constant';
import { MEDIA_TYPE } from '../../shared/enumerations/media-type.enum';
import { POSTER_SIZE } from '../../shared/enumerations/poster-size.enum';
import { PROFILE_SIZE } from '../../shared/enumerations/profile-size.enum';
import { SEARCH_OPTION } from '../../shared/enumerations/search-option.enum';
import { AllSearchItems, SearchFacade } from '../../shared/facades/search.facade';
import { KnownForItem } from '../../shared/models/known-for-item.model';
import { Movie } from '../../shared/models/movie.model';
import { Person } from '../../shared/models/people.model';
import { SearchResult } from '../../shared/models/search.model';
import { TvShow } from '../../shared/models/tv-show.model';

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.smallPosterSize;
    public posterFallback = DEFAULT.smallPosterFallback;
    public profileSize: PROFILE_SIZE = DEFAULT.mediumProfileSize;
    public profileFallback = DEFAULT.mediumProfileFallback;
    public SEARCH_FILTER = SEARCH_OPTION;
    public allSearchItems!: AllSearchItems;
    public searchMulti: Array<SearchResult> = [];
    public searchMovies: Array<Movie> = [];
    public searchTvSeries: Array<TvShow> = [];
    public searchPeople: Array<Person> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;
    public searchQuery: string = '';
    public searchFilter = DEFAULT.searchOption;

    constructor(
        private searchFacade: SearchFacade,
        private route: ActivatedRoute,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.listenForUrlParamterers();
    }

    public isMovie(item: KnownForItem): boolean {
        return item.media_type === MEDIA_TYPE.Movie;
    }

    public onLoadMore(): void {
        this.currentPage++;

        switch (this.searchFilter) {
            case SEARCH_OPTION.Multi:
                this.getMulti(true, this.searchQuery, this.currentPage);
                break;
            case SEARCH_OPTION.Movie:
                this.getMovies(true, this.searchQuery, this.currentPage);
                break;
            case SEARCH_OPTION.Tv:
                this.getTvSeries(true, this.searchQuery, this.currentPage);
                break;
            case SEARCH_OPTION.Person:
                this.getPeople(true, this.searchQuery, this.currentPage);
                break;
        }
    }

    public setSearchFilter(filter: SEARCH_OPTION): void {
        this.currentPage = DEFAULT.page;
        this.totalPages = DEFAULT.totalPages;
        this.searchFilter = filter;

        switch (this.searchFilter) {
            case SEARCH_OPTION.Multi:
                this.getMulti(false, this.searchQuery, this.currentPage);
                break;
            case SEARCH_OPTION.Movie:
                this.getMovies(false, this.searchQuery, this.currentPage);
                break;
            case SEARCH_OPTION.Tv:
                this.getTvSeries(false, this.searchQuery, this.currentPage);
                break;
            case SEARCH_OPTION.Person:
                this.getPeople(false, this.searchQuery, this.currentPage);
                break;
        }
    }

    private listenForUrlParamterers(): void {
        this.route.fragment.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((filter) => {
            const searchFilter = filter;

            switch (searchFilter) {
                case SEARCH_OPTION.Multi:
                    this.setSearchFilter(SEARCH_OPTION.Multi);
                    break;
                case SEARCH_OPTION.Movie:
                    this.setSearchFilter(SEARCH_OPTION.Movie);
                    break;
                case SEARCH_OPTION.Tv:
                    this.setSearchFilter(SEARCH_OPTION.Tv);
                    break;
                case SEARCH_OPTION.Person:
                    this.setSearchFilter(SEARCH_OPTION.Person);
                    break;
                default:
                    this.setSearchFilter(DEFAULT.searchOption);
                    break;
            }
        });

        this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: Params) => {
            const queryParam = params['query'] as string;

            if (queryParam) {
                this.searchQuery = queryParam.trim();
                this.getAll(queryParam);
                this.setSearchFilter(this.searchFilter);
            } else {
                this.searchQuery = '';
            }
        });
    }

    private getMulti(loadMore: boolean = false, query: string, page: number): void {
        this.searchFacade
            .getMulti(query, page)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((searchMulti) => {
                if (loadMore) {
                    this.searchMulti = [...this.searchMulti, ...searchMulti.results];
                } else {
                    this.searchMulti = searchMulti.results;
                }

                this.currentPage = searchMulti.page;
                this.totalPages = searchMulti.total_pages;
            });
    }

    private getMovies(loadMore: boolean = false, query: string, page: number): void {
        this.searchFacade
            .getMovies(query, page)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((searchMovies) => {
                if (loadMore) {
                    this.searchMovies = [...this.searchMovies, ...searchMovies.results];
                } else {
                    this.searchMovies = searchMovies.results;
                }

                this.currentPage = searchMovies.page;
                this.totalPages = searchMovies.total_pages;
            });
    }

    private getTvSeries(loadMore: boolean = false, query: string, page: number): void {
        this.searchFacade
            .getTvSeries(query, page)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((searchTvSeries) => {
                if (loadMore) {
                    this.searchTvSeries = [...this.searchTvSeries, ...searchTvSeries.results];
                } else {
                    this.searchTvSeries = searchTvSeries.results;
                }

                this.currentPage = searchTvSeries.page;
                this.totalPages = searchTvSeries.total_pages;
            });
    }

    private getPeople(loadMore: boolean = false, query: string, page: number): void {
        this.searchFacade
            .getPeople(query, page)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((searchPeople) => {
                if (loadMore) {
                    this.searchPeople = [...this.searchPeople, ...searchPeople.results];
                } else {
                    this.searchPeople = searchPeople.results;
                }

                this.currentPage = searchPeople.page;
                this.totalPages = searchPeople.total_pages;
            });
    }

    private getAll(query: string): void {
        this.searchFacade
            .getAll(query)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((allSearchItems) => {
                this.allSearchItems = allSearchItems;
            });
    }
}
