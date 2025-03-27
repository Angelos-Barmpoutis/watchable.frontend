import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FadeInDirective } from '../../directives/fade-in.directive';
import { BACKDROP_SIZE } from '../../enumerations/backdrop-size.enum';
import { MEDIA_TYPE } from '../../enumerations/media-type.enum';
import { POSTER_SIZE } from '../../enumerations/poster-size.enum';
import { getBackgroundImageUrl } from '../../helpers/background-image-url';
import { mapGenres } from '../../helpers/genres.helper';
import { Genre } from '../../models/genre.model';
import { Movie } from '../../models/movie.model';
import { TvShow } from '../../models/tv-show.model';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
    selector: 'app-featured-banner',
    standalone: true,
    imports: [CommonModule, RouterLink, FadeInDirective],
    templateUrl: './featured-banner.component.html',
    styleUrl: './featured-banner.component.scss',
})
export class FeaturedBannerComponent implements OnChanges {
    @Input() featuredItem!: Movie | TvShow;
    @Input() mediaType: MEDIA_TYPE = MEDIA_TYPE.Movie;
    @Input() isLoading: boolean = false;

    readonly MEDIA_TYPE = MEDIA_TYPE;
    readonly POSTER_SIZE = POSTER_SIZE;

    genresList: string = '';

    constructor(private localStorageService: LocalStorageService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['featuredItem'] && this.featuredItem) {
            this.mapGenresToString();
        }
    }

    get featuredTitle(): string {
        if (!this.featuredItem) return '';

        return this.mediaType === MEDIA_TYPE.Movie
            ? (this.featuredItem as Movie).title
            : (this.featuredItem as TvShow).name;
    }

    get featuredDate(): string {
        if (!this.featuredItem) return '';

        return this.mediaType === MEDIA_TYPE.Movie
            ? (this.featuredItem as Movie).release_date
            : (this.featuredItem as TvShow).first_air_date;
    }

    get featuredBackdropUrl(): string {
        if (!this.featuredItem || !this.featuredItem.backdrop_path) return '';

        return getBackgroundImageUrl(BACKDROP_SIZE.original, this.featuredItem.backdrop_path);
    }

    get mediaRoute(): string {
        return this.mediaType === MEDIA_TYPE.Movie ? '/movies/movie' : '/tv-shows/tv-show';
    }

    private mapGenresToString(): void {
        const storageKey = this.mediaType === MEDIA_TYPE.Movie ? 'movieGenres' : 'tvShowGenres';
        const allGenres = this.localStorageService.getItem<Array<Genre>>(storageKey) || [];
        this.genresList = mapGenres(this.featuredItem.genre_ids, allGenres);
    }
}
