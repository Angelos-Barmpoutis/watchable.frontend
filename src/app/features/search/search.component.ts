import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { takeUntil } from 'rxjs';

import { POSTER_SIZE } from '../../core/enumerations/poster-size.enum';
import { PROFILE_SIZE } from '../../core/enumerations/profile-size.enum';
import { SEARCH_FILTER } from '../../core/enumerations/search-filter.enum';
import { Movie } from '../../core/models/movies/movie.model';
import { Person } from '../../core/models/people/person.model';
import { KnownForItem } from '../../core/models/shared/known-for-item.model';
import { SearchItem } from '../../core/models/shared/search-item.model';
import { TvSeries } from '../../core/models/tv-series/tv-series.model';
import { DEFAULT } from '../../shared/constants/defaults.constant';
import { PosterPathDirective } from '../../shared/directives/poster-path.directive';
import { ProfilePathDirective } from '../../shared/directives/profile-path.directive';
import { AllSearchItems, SearchFacade } from '../../shared/facades/search.facade';
import { BaseComponent } from '../../shared/helpers/base.component';

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [CommonModule, PosterPathDirective, ProfilePathDirective, RouterLink],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
})
export class SearchComponent extends BaseComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.smallPosterSize;
    public posterFallback = DEFAULT.smallPosterFallback;
    public profileSize: PROFILE_SIZE = DEFAULT.mediumProfileSize;
    public profileFallback = DEFAULT.mediumProfileFallback;
    public SEARCH_FILTER = SEARCH_FILTER;
    public allSearchItems!: AllSearchItems;
    public searchMulti: Array<SearchItem> = [];
    public searchMovies: Array<Movie> = [];
    public searchTvSeries: Array<TvSeries> = [];
    public searchPeople: Array<Person> = [];
    public currentPage = DEFAULT.page;
    public totalPages = DEFAULT.totalPages;
    public searchQuery: string = '';
    public searchFilter = DEFAULT.searchFilter;

    constructor(
        private searchFacade: SearchFacade,
        private route: ActivatedRoute,
    ) {
        super();
    }

    ngOnInit(): void {
        this.listenForUrlParamterers();
    }

    public isMovie(item: KnownForItem): boolean {
        return item.media_type === 'movie';
    }

    public onLoadMore(): void {
        this.currentPage++;

        switch (this.searchFilter) {
            case SEARCH_FILTER.Multi:
                this.getMulti(true, this.searchQuery, this.currentPage);
                break;
            case SEARCH_FILTER.Movie:
                this.getMovies(true, this.searchQuery, this.currentPage);
                break;
            case SEARCH_FILTER.Tv:
                this.getTvSeries(true, this.searchQuery, this.currentPage);
                break;
            case SEARCH_FILTER.Person:
                this.getPeople(true, this.searchQuery, this.currentPage);
                break;
        }
    }

    public setSearchFilter(filter: SEARCH_FILTER): void {
        this.currentPage = DEFAULT.page;
        this.totalPages = DEFAULT.totalPages;
        this.searchFilter = filter;

        switch (this.searchFilter) {
            case SEARCH_FILTER.Multi:
                this.getMulti(false, this.searchQuery, this.currentPage);
                break;
            case SEARCH_FILTER.Movie:
                this.getMovies(false, this.searchQuery, this.currentPage);
                break;
            case SEARCH_FILTER.Tv:
                this.getTvSeries(false, this.searchQuery, this.currentPage);
                break;
            case SEARCH_FILTER.Person:
                this.getPeople(false, this.searchQuery, this.currentPage);
                break;
        }
    }

    private listenForUrlParamterers(): void {
        this.route.fragment.pipe(takeUntil(this.destroyed)).subscribe((filter) => {
            const searchFilter = filter;

            switch (searchFilter) {
                case SEARCH_FILTER.Multi:
                    this.setSearchFilter(SEARCH_FILTER.Multi);
                    break;
                case SEARCH_FILTER.Movie:
                    this.setSearchFilter(SEARCH_FILTER.Movie);
                    break;
                case SEARCH_FILTER.Tv:
                    this.setSearchFilter(SEARCH_FILTER.Tv);
                    break;
                case SEARCH_FILTER.Person:
                    this.setSearchFilter(SEARCH_FILTER.Person);
                    break;
                default:
                    this.setSearchFilter(DEFAULT.searchFilter);
                    break;
            }
        });

        this.route.queryParams.pipe(takeUntil(this.destroyed)).subscribe((params: Params) => {
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
            .pipe(takeUntil(this.destroyed))
            .subscribe((searchMulti) => {
                if (loadMore) {
                    this.searchMulti = [...this.searchMulti, ...searchMulti.results];
                } else {
                    this.searchMulti = searchMulti.results;
                }

                this.currentPage = +searchMulti.page;
                this.totalPages = +searchMulti.total_pages;
            });
    }

    private getMovies(loadMore: boolean = false, query: string, page: number): void {
        this.searchFacade
            .getMovies(query, page)
            .pipe(takeUntil(this.destroyed))
            .subscribe((searchMovies) => {
                if (loadMore) {
                    this.searchMovies = [...this.searchMovies, ...searchMovies.results];
                } else {
                    this.searchMovies = searchMovies.results;
                }

                this.currentPage = +searchMovies.page;
                this.totalPages = +searchMovies.total_pages;
            });
    }

    private getTvSeries(loadMore: boolean = false, query: string, page: number): void {
        this.searchFacade
            .getTvSeries(query, page)
            .pipe(takeUntil(this.destroyed))
            .subscribe((searchTvSeries) => {
                if (loadMore) {
                    this.searchTvSeries = [...this.searchTvSeries, ...searchTvSeries.results];
                } else {
                    this.searchTvSeries = searchTvSeries.results;
                }

                this.currentPage = +searchTvSeries.page;
                this.totalPages = +searchTvSeries.total_pages;
            });
    }

    private getPeople(loadMore: boolean = false, query: string, page: number): void {
        this.searchFacade
            .getPeople(query, page)
            .pipe(takeUntil(this.destroyed))
            .subscribe((searchPeople) => {
                if (loadMore) {
                    this.searchPeople = [...this.searchPeople, ...searchPeople.results];
                } else {
                    this.searchPeople = searchPeople.results;
                }

                this.currentPage = +searchPeople.page;
                this.totalPages = +searchPeople.total_pages;
            });
    }

    private getAll(query: string): void {
        this.searchFacade
            .getAll(query)
            .pipe(takeUntil(this.destroyed))
            .subscribe((allSearchItems) => {
                this.allSearchItems = allSearchItems;
            });
    }
}
