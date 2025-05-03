import { Directive, HostBinding, Input } from '@angular/core';

import { environment } from '../../../environments/environment';
import { BackdropSize } from '../enumerations/backdrop-size.enum';

@Directive({
    selector: '[appBackdropPath]',
    standalone: true,
})
export class BackdropPathDirective {
    @Input() backdropPath: string = '';
    @Input() baseUrl: string = environment.imageBaseUrl;
    @Input() size: BackdropSize = BackdropSize.w1280;

    @HostBinding('src') get imageUrl(): string {
        return `${this.baseUrl}${this.size}${this.backdropPath}`;
    }

    @HostBinding('srcset') get imageSrcset(): string {
        // Apply srcset for large and medium images
        if (this.size === BackdropSize.w1280) {
            return [
                `${this.baseUrl}${BackdropSize.w780}${this.backdropPath} 390w`,
                `${this.baseUrl}${BackdropSize.w1280}${this.backdropPath} 640w`,
                `${this.baseUrl}${BackdropSize.original}${this.backdropPath} 960w`,
            ].join(', ');
        } else if (this.size === BackdropSize.w780) {
            return [
                `${this.baseUrl}${BackdropSize.w780}${this.backdropPath} 390w`,
                `${this.baseUrl}${BackdropSize.original}${this.backdropPath} 960w`,
            ].join(', ');
        } else if (this.size === BackdropSize.original) {
            return [
                `${this.baseUrl}${BackdropSize.w780}${this.backdropPath} 390w`,
                `${this.baseUrl}${BackdropSize.w1280}${this.backdropPath} 640w`,
                `${this.baseUrl}${BackdropSize.original}${this.backdropPath} 960w`,
            ].join(', ');
        }
        return '';
    }

    @HostBinding('sizes') get imageSizes(): string {
        // Apply sizes for large and medium images
        if (this.size === BackdropSize.w1280) {
            return '(max-width: 576px) 390px, (max-width: 1200px) 390px, (max-width: 1920px) 640px, 960px';
        } else if (this.size === BackdropSize.w780) {
            return '(max-width: 576px) 390px, (max-width: 1920px) 390px, 960px';
        } else if (this.size === BackdropSize.original) {
            return '(max-width: 576px) 390px, (max-width: 1200px) 390px, (max-width: 1920px) 640px, 960px';
        }
        return '';
    }
}
