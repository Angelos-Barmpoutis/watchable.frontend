import { Directive, HostBinding, Input } from '@angular/core';

import { environment } from '../../../environments/environment';
import { BackdropSize } from '../enumerations/backdrop-size.enum';

/**
 * Background path directive for automatically generating TMDB background image URLs
 * Binds the background-image style with a complete TMDB image URL based on path and size
 */
@Directive({
    selector: '[appBackgroundPath]',
    standalone: true,
})
export class BackgroundPathDirective {
    /** The background image path from TMDB API */
    @Input() backgroundPath!: string;

    /** The base URL for TMDB images (defaults to environment setting) */
    @Input() baseUrl: string = environment.imageBaseUrl;

    /** The backdrop size variant to use (defaults to original) */
    @Input() size: BackdropSize = BackdropSize.original;

    /**
     * Generates the complete background image URL and binds it to the background-image style
     * @returns CSS url() value with complete TMDB image URL
     */
    @HostBinding('style.background-image')
    get backgroundImage(): string {
        return `url('${this.baseUrl}${this.size}${this.backgroundPath}')`;
    }
}
