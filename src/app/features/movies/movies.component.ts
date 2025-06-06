// movies.component.ts
import { CommonModule } from '@angular/common';
import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { AbstractGenreLoaderComponent } from '../../shared/abstract/genre-loader.abstract';
import { CarouselMediaComponent } from '../../shared/components/carousel-media/carousel-media.component';
import { FeaturedBannerComponent } from '../../shared/components/featured-banner/featured-banner.component';
import { InfiniteScrollLoaderComponent } from '../../shared/components/infinite-scroll-loader/infinite-scroll-loader.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { MediaType } from '../../shared/enumerations/media-type.enum';
import { MovieFacade } from '../../shared/facades/movie.facade';
import { filterMediaItems } from '../../shared/helpers/filter-items.helper';
import { Movie, PaginatedMovies } from '../../shared/models/movie.model';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Component({
    standalone: true,
    selector: 'app-movies',
    templateUrl: './movies.component.html',
    styleUrl: './movies.component.scss',
    imports: [
        CommonModule,
        SectionHeaderComponent,
        CarouselMediaComponent,
        InfiniteScrollLoaderComponent,
        FeaturedBannerComponent,
    ]
})
export class MoviesComponent extends AbstractGenreLoaderComponent<Movie> {
    readonly mediaType = MediaType;
    nowPlaying: Array<Movie> = [];
    popular: Array<Movie> = [];
    topRated: Array<Movie> = [];
    upcoming: Array<Movie> = [];
    isMainContentLoading = false;

    protected override type = MediaType.Movie;
    protected override genreStorageKey = 'movieGenres';

    constructor(
        private movieFacade: MovieFacade,
        destroyRef: DestroyRef,
        localStorageService: LocalStorageService,
    ) {
        super(destroyRef, localStorageService);
    }

    protected loadInitialContent(): void {
        this.isMainContentLoading = true;
        this.movieFacade
            .getAllMovies()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((allMovies) => {
                this.nowPlaying = filterMediaItems(allMovies.nowPlaying.results) as Array<Movie>;
                this.popular = filterMediaItems(allMovies.popular.results) as Array<Movie>;
                this.topRated = filterMediaItems(allMovies.topRated.results) as Array<Movie>;
                this.upcoming = filterMediaItems(allMovies.upcoming.results) as Array<Movie>;
                this.isMainContentLoading = false;
            });
    }

    protected getItemsByGenreIds(
        currentGenreIndex: number,
        genresPerBatch: number,
    ): Observable<Record<string, PaginatedMovies>> {
        return this.movieFacade.getMoviesByGenreIds(currentGenreIndex, genresPerBatch);
    }
}
