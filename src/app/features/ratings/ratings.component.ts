import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

import { BaseMediaListItemComponent } from '../../shared/abstract/base-media-list-item.abstract';
import { InfiniteScrollLoaderComponent } from '../../shared/components/infinite-scroll-loader/infinite-scroll-loader.component';
import { MediaListItemComponent } from '../../shared/components/media-list-item/media-list-item.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { TabItem, TabsComponent } from '../../shared/components/tabs/tabs.component';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';
import { MediaType } from '../../shared/enumerations/media-type.enum';
import { AccountFacade } from '../../shared/facades/account.facade';
import { mapMoviesWithGenres, mapTvShowsWithGenres } from '../../shared/helpers/genres.helper';
import { Genre } from '../../shared/models/genre.model';
import { Movie, MovieItem, PaginatedMovies } from '../../shared/models/movie.model';
import { PaginatedTvShows, TvShow, TvShowItem } from '../../shared/models/tv-show.model';
import { AuthService } from '../../shared/services/auth.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Component({
    selector: 'app-ratings',
    standalone: true,
    imports: [
        CommonModule,
        MediaListItemComponent,
        InfiniteScrollLoaderComponent,
        TabsComponent,
        SectionHeaderComponent,
        FadeInDirective,
    ],
    templateUrl: './ratings.component.html',
    styleUrl: './ratings.component.scss',
})
export class RatingsComponent extends BaseMediaListItemComponent<MovieItem | TvShowItem> implements OnInit {
    override items: Array<MovieItem | TvShowItem> = [];
    private movieGenres: Array<Genre> = [];
    private tvShowGenres: Array<Genre> = [];

    readonly tabs: Array<TabItem<MediaType>> = [
        { id: 0, value: MediaType.Movie, label: 'Movies' },
        { id: 1, value: MediaType.TvShow, label: 'TV Shows' },
    ];

    readonly MediaType: MediaType = MediaType.Movie;

    selectedMediaType: MediaType = this.MediaType;

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

    mapItemsWithGenres(items: Array<MovieItem | TvShowItem>, genres: Array<Genre>): Array<MovieItem | TvShowItem> {
        if (this.selectedMediaType === MediaType.Movie) {
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
                    return this.selectedMediaType === MediaType.Movie
                        ? this.accountFacade.getRatedMovies(this.currentPage)
                        : this.accountFacade.getRatedTVShows(this.currentPage);
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((response: PaginatedMovies | PaginatedTvShows) => {
                const itemsWithGenres = this.mapItemsWithGenres(
                    response.results as Array<MovieItem | TvShowItem>,
                    this.selectedMediaType === MediaType.Movie ? this.movieGenres : this.tvShowGenres,
                );

                this.items = [...this.items, ...itemsWithGenres];
                this.currentPage = response.page;
                this.totalPages = response.total_pages;
                this.isLoading = false;
            });
    }

    changeMediaType(tab: MediaType): void {
        this.selectedMediaType = tab;
        this.items = [];
        this.currentPage = 1;
        this.getItems();
    }
}
