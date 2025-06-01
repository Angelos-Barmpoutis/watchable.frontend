import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { BackgroundPathDirective } from '../../directives/background-path.directive';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { BackdropSize } from '../../enumerations/backdrop-size.enum';
import { MediaType } from '../../enumerations/media-type.enum';
import { PosterSize as PosterSize } from '../../enumerations/poster-size.enum';
import { mapGenres } from '../../helpers/genres.helper';
import { Genre } from '../../models/genre.model';
import { Movie } from '../../models/movie.model';
import { TvShow } from '../../models/tv-show.model';
import { LocalStorageService } from '../../services/local-storage.service';
import { ButtonComponent } from '../button/button.component';
import { ButtonType } from '../button/enumerations/button-type.enum';
import { ButtonLink } from '../button/models/button.model';

@Component({
    standalone: true,
    selector: 'app-featured-banner',
    imports: [CommonModule, FadeInDirective, ButtonComponent, BackgroundPathDirective],
    templateUrl: './featured-banner.component.html',
    styleUrl: './featured-banner.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturedBannerComponent implements OnChanges {
    @Input() featuredItem!: Movie | TvShow;
    @Input() type: MediaType = MediaType.Movie;
    @Input() isLoading: boolean = false;

    readonly mediaType = MediaType;
    readonly posterSize = PosterSize;
    readonly buttonType = ButtonType;
    readonly backdropSize = BackdropSize;

    genresList: string = '';

    constructor(private localStorageService: LocalStorageService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['featuredItem'] && this.featuredItem) {
            this.mapGenresToString();
        }
    }

    get backgroundPath(): string {
        return this.featuredItem.backdrop_path ?? '';
    }

    get link(): ButtonLink {
        const id = this.featuredItem?.id?.toString();

        return {
            path: [this.mediaRoute, id],
            isExternal: false,
        };
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

    get mediaRoute(): string {
        return this.type === MediaType.Movie ? '/movies/movie' : '/tv-shows/tv-show';
    }

    private mapGenresToString(): void {
        const storageKey = this.type === MediaType.Movie ? 'movieGenres' : 'tvShowGenres';
        const allGenres = this.localStorageService.getItem<Array<Genre>>(storageKey) || [];
        this.genresList = mapGenres(this.featuredItem.genre_ids, allGenres);
    }
}
