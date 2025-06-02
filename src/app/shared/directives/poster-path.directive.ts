import { Directive, HostBinding, Input } from '@angular/core';

import { environment } from '../../../environments/environment';
import { PosterSize } from '../enumerations/poster-size.enum';

/**
 * Poster path directive for automatically generating TMDB poster image URLs
 * Binds the src attribute with a complete TMDB poster image URL based on path and size
 */
@Directive({
    selector: '[appPosterPath]',
    standalone: true,
})
export class PosterPathDirective {
    /** The poster image path from TMDB API */
    @Input() posterPath!: string;

    /** The base URL for TMDB images (defaults to environment setting) */
    @Input() baseUrl: string = environment.imageBaseUrl;

    /** The poster size variant to use (defaults to original) */
    @Input() size: PosterSize = PosterSize.original;

    /**
     * Generates the complete poster image URL and binds it to the src attribute
     * @returns Complete TMDB poster image URL
     */
    @HostBinding('src') get imageUrl(): string {
        return `${this.baseUrl}${this.size}${this.posterPath}`;
    }
}
