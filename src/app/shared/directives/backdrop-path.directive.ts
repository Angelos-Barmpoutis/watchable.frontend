import { Directive, HostBinding, Input } from '@angular/core';

import { environment } from '../../../environments/environment';
import { BackdropSize } from '../enumerations/backdrop-size.enum';

/**
 * Backdrop path directive for automatically generating TMDB backdrop image URLs
 * Binds the src attribute with a complete TMDB backdrop image URL based on path and size
 */
@Directive({
    selector: '[appBackdropPath]',
    standalone: true,
})
export class BackdropPathDirective {
    /** The backdrop image path from TMDB API */
    @Input() backdropPath!: string;

    /** The base URL for TMDB images (defaults to environment setting) */
    @Input() baseUrl: string = environment.imageBaseUrl;

    /** The backdrop size variant to use (defaults to w1280) */
    @Input() size: BackdropSize = BackdropSize.w1280;

    /**
     * Generates the complete backdrop image URL and binds it to the src attribute
     * @returns Complete TMDB backdrop image URL
     */
    @HostBinding('src') get imageUrl(): string {
        return `${this.baseUrl}${this.size}${this.backdropPath}`;
    }
}
