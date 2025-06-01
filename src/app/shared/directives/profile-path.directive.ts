import { Directive, HostBinding, Input } from '@angular/core';

import { environment } from '../../../environments/environment';
import { ProfileSize } from '../enumerations/profile-size.enum';

/**
 * Profile path directive for automatically generating TMDB profile image URLs
 * Binds the src attribute with a complete TMDB image URL based on path and size
 */
@Directive({
    selector: '[appProfilePath]',
    standalone: true,
})
export class ProfilePathDirective {
    /** The profile image path from TMDB API */
    @Input() profilePath!: string;

    /** The base URL for TMDB images (defaults to environment setting) */
    @Input() baseUrl: string = environment.imageBaseUrl;

    /** The image size variant to use (defaults to original) */
    @Input() size: ProfileSize = ProfileSize.original;

    /**
     * Generates the complete image URL and binds it to the src attribute
     * @returns Complete TMDB image URL
     */
    @HostBinding('src') get imageUrl(): string {
        return `${this.baseUrl}${this.size}${this.profilePath}`;
    }
}
