import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

import { BaseMediaListItemComponent } from '../../shared/abstract/base-media-list-item.abstract';
import { EpisodeGridItemComponent } from '../../shared/components/episode-grid-item/episode-grid-item.component';
import { InfiniteScrollLoaderComponent } from '../../shared/components/infinite-scroll-loader/infinite-scroll-loader.component';
import { MediaListItemComponent } from '../../shared/components/media-list-item/media-list-item.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { TabItem, TabsComponent } from '../../shared/components/tabs/tabs.component';
import { DEFAULT } from '../../shared/constants/defaults.constant';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';
import { MediaType } from '../../shared/enumerations/media-type.enum';
import { AccountFacade } from '../../shared/facades/account.facade';
import { mapMoviesWithGenres, mapTvShowsWithGenres } from '../../shared/helpers/genres.helper';
import { Genre } from '../../shared/models/genre.model';
import { Movie, MovieItem, PaginatedMovies } from '../../shared/models/movie.model';
import {
    PaginatedTvShowEpisodes,
    PaginatedTvShows,
    TvShow,
    TvShowEpisode,
    TvShowItem,
} from '../../shared/models/tv-show.model';
import { AuthService } from '../../shared/services/auth.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Component({
    standalone: true,
    selector: 'app-ratings',
    imports: [
        CommonModule,
        MediaListItemComponent,
        InfiniteScrollLoaderComponent,
        TabsComponent,
        SectionHeaderComponent,
        FadeInDirective,
        EpisodeGridItemComponent,
    ],
    templateUrl: './ratings.component.html',
    styleUrl: './ratings.component.scss'
})
export class RatingsComponent extends BaseMediaListItemComponent<MovieItem | TvShowItem> implements OnInit {
    override items: Array<MovieItem | TvShowItem> = [];
    episodes: Array<TvShowEpisode> = [];
    private movieGenres: Array<Genre> = [];
    private tvShowGenres: Array<Genre> = [];

    readonly TV_EPISODE_KEY = 'tvEpisodes';

    readonly tabs: Array<TabItem<string>> = [
        { id: 0, value: MediaType.Movie, label: 'Movies' },
        { id: 1, value: MediaType.TvShow, label: 'TV Shows' },
        { id: 2, value: this.TV_EPISODE_KEY, label: 'TV Episodes' },
    ];

    readonly MediaType = MediaType;

    selectedTab: string = this.tabs[0].value;

    constructor(
        private accountFacade: AccountFacade,
        private localStorageService: LocalStorageService,
        private authService: AuthService,
        destroyRef: DestroyRef,
    ) {
        super(destroyRef);
    }

    trackByItemId(index: number, item: MovieItem | TvShowItem): number {
        return item.id;
    }

    trackByEpisodeId(index: number, item: TvShowEpisode): number {
        return item.id;
    }

    mapItemsWithGenres(items: Array<MovieItem | TvShowItem>, genres: Array<Genre>): Array<MovieItem | TvShowItem> {
        if (this.selectedTab === this.tabs[0].value) {
            return mapMoviesWithGenres(items as Array<Movie>, genres);
        }
        return mapTvShowsWithGenres(items as Array<TvShow>, genres);
    }

    getGenres(): void {
        this.movieGenres = this.localStorageService.getItem<Array<Genre>>('movieGenres') ?? [];
        this.tvShowGenres = this.localStorageService.getItem<Array<Genre>>('tvShowGenres') ?? [];
    }

    getItems(): void {
        this.isLoading = true;
        this.authService.userInfo$
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                switchMap((userInfo) => {
                    if (!userInfo) return [];

                    if (this.selectedTab === this.TV_EPISODE_KEY) {
                        return this.accountFacade.getRatedTvShowEpisodes(userInfo.id, this.currentPage);
                    }

                    return this.selectedTab === this.tabs[0].value
                        ? this.accountFacade.getRatedMovies(userInfo.id, this.currentPage)
                        : this.accountFacade.getRatedTVShows(userInfo.id, this.currentPage);
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((response: PaginatedMovies | PaginatedTvShows | PaginatedTvShowEpisodes) => {
                if (this.selectedTab === this.TV_EPISODE_KEY) {
                    const episodesResponse = response as PaginatedTvShowEpisodes;
                    this.episodes = [...this.episodes, ...episodesResponse.results];
                    this.currentPage = episodesResponse.page;
                    this.totalPages = episodesResponse.total_pages;
                } else {
                    const itemsWithGenres = this.mapItemsWithGenres(
                        (response as PaginatedMovies | PaginatedTvShows).results as Array<MovieItem | TvShowItem>,
                        this.selectedTab === this.tabs[0].value ? this.movieGenres : this.tvShowGenres,
                    );
                    this.items = [...this.items, ...itemsWithGenres];
                    this.currentPage = response.page;
                    this.totalPages = response.total_pages;
                }
                this.isLoading = false;
            });
    }

    changeTab(tab: string): void {
        this.selectedTab = tab;
        this.items = [];
        this.episodes = [];
        this.currentPage = DEFAULT.page;
        this.totalPages = DEFAULT.totalPages;
        this.getItems();
    }
}
