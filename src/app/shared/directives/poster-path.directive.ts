import { Directive, HostBinding, Input } from '@angular/core';

import { environment } from '../../../environments/environment';
import { PosterSize } from '../enumerations/poster-size.enum';

@Directive({
    selector: '[appPosterPath]',
    standalone: true,
})
export class PosterPathDirective {
    @Input() posterPath: string = '';
    @Input() baseUrl: string = environment.imageBaseUrl;
    @Input() size: PosterSize = PosterSize.original;

    @HostBinding('src') get imageUrl(): string {
        return `${this.baseUrl}${this.size}${this.posterPath}`;
    }

    @HostBinding('srcset') get imageSrcset(): string {
        // Apply srcset for large and medium images
        if (this.size === PosterSize.w780) {
            return [
                `${this.baseUrl}${PosterSize.w342}${this.posterPath} 342w`,
                `${this.baseUrl}${PosterSize.w500}${this.posterPath} 500w`,
                `${this.baseUrl}${PosterSize.w780}${this.posterPath} 780w`,
                `${this.baseUrl}${PosterSize.original}${this.posterPath} 1000w`,
            ].join(', ');
        } else if (this.size === PosterSize.w500) {
            return [
                `${this.baseUrl}${PosterSize.w342}${this.posterPath} 342w`,
                `${this.baseUrl}${PosterSize.w500}${this.posterPath} 500w`,
                `${this.baseUrl}${PosterSize.original}${this.posterPath} 1000w`,
            ].join(', ');
        } else if (this.size === PosterSize.original) {
            return [
                `${this.baseUrl}${PosterSize.w342}${this.posterPath} 342w`,
                `${this.baseUrl}${PosterSize.w500}${this.posterPath} 500w`,
                `${this.baseUrl}${PosterSize.w780}${this.posterPath} 780w`,
                `${this.baseUrl}${PosterSize.original}${this.posterPath} 1000w`,
            ].join(', ');
        }
        return '';
    }

    @HostBinding('sizes') get imageSizes(): string {
        // Apply sizes for large and medium images
        if (this.size === PosterSize.w780) {
            return '(max-width: 576px) 171px, (max-width: 1200px) 250px, (max-width: 1920px) 390px, 500px';
        } else if (this.size === PosterSize.w500) {
            return '(max-width: 576px) 171px, (max-width: 1920px) 250px, 500px';
        } else if (this.size === PosterSize.original) {
            return '(max-width: 576px) 171px, (max-width: 1200px) 250px, (max-width: 1920px) 390px, 500px';
        }
        return '';
    }
}
