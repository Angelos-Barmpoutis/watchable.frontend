import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FadeInDirective } from '../../directives/fade-in.directive';
import { BackdropSize } from '../../enumerations/backdrop-size.enum';
import { ButtonType } from '../../enumerations/components/button-type.enum';
import { MediaType } from '../../enumerations/media-type.enum';
import { PosterSize as PosterSize } from '../../enumerations/poster-size.enum';
import { getBackgroundImageUrl } from '../../helpers/background-image-url';
import { mapGenres } from '../../helpers/genres.helper';
import { Genre } from '../../models/genre.model';
import { Movie } from '../../models/movie.model';
import { TvShow } from '../../models/tv-show.model';
import { LocalStorageService } from '../../services/local-storage.service';
import { ButtonComponent } from '../button/button.component';

@Component({
    selector: 'app-featured-banner',
    standalone: true,
    imports: [CommonModule, RouterLink, FadeInDirective, ButtonComponent],
    templateUrl: './featured-banner.component.html',
    styleUrl: './featured-banner.component.scss',
})
export class FeaturedBannerComponent implements OnChanges {
    @Input() featuredItem!: Movie | TvShow;
    @Input() type: MediaType = MediaType.Movie;
    @Input() isLoading: boolean = false;

    readonly mediaType = MediaType;
    readonly posterSize = PosterSize;
    readonly buttonType = ButtonType;

    genresList: string = '';

    constructor(private localStorageService: LocalStorageService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['featuredItem'] && this.featuredItem) {
            this.mapGenresToString();
        }
    }

    get featuredTitle(): string {
        if (!this.featuredItem) return '';

        return this.type === MediaType.Movie ? (this.featuredItem as Movie).title : (this.featuredItem as TvShow).name;
    }

    get featuredDate(): string {
        if (!this.featuredItem) return '';

        return this.type === MediaType.Movie
            ? (this.featuredItem as Movie).release_date
            : (this.featuredItem as TvShow).first_air_date;
    }

    get featuredBackdropUrl(): string {
        if (!this.featuredItem || !this.featuredItem.backdrop_path) return '';

        return getBackgroundImageUrl(BackdropSize.original, this.featuredItem.backdrop_path);
    }

    get mediaRoute(): string {
        return this.type === MediaType.Movie ? '/movies/movie' : '/tv-shows/tv-show';
    }

    private mapGenresToString(): void {
        const storageKey = this.type === MediaType.Movie ? 'movieGenres' : 'tvShowGenres';
        const allGenres = this.localStorageService.getItem<Array<Genre>>(storageKey) || [];
        this.genresList = mapGenres(this.featuredItem.genre_ids, allGenres);
    }
}
