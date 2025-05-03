import { Directive, HostBinding, Input } from '@angular/core';

import { environment } from '../../../environments/environment';
import { ProfileSize } from '../enumerations/profile-size.enum';

@Directive({
    selector: '[appProfilePath]',
    standalone: true,
})
export class ProfilePathDirective {
    @Input() profilePath: string = '';
    @Input() baseUrl: string = environment.imageBaseUrl;
    @Input() size: ProfileSize = ProfileSize.original;

    @HostBinding('src') get imageUrl(): string {
        return `${this.baseUrl}${this.size}${this.profilePath}`;
    }

    @HostBinding('srcset') get imageSrcset(): string {
        // Apply srcset for large and medium images
        if (this.size === ProfileSize.w632) {
            return [
                `${this.baseUrl}${ProfileSize.w185}${this.profilePath} 185w`,
                `${this.baseUrl}${ProfileSize.w632}${this.profilePath} 632w`,
                `${this.baseUrl}${ProfileSize.original}${this.profilePath} 1000w`,
            ].join(', ');
        } else if (this.size === ProfileSize.w185) {
            return [
                `${this.baseUrl}${ProfileSize.w185}${this.profilePath} 185w`,
                `${this.baseUrl}${ProfileSize.original}${this.profilePath} 1000w`,
            ].join(', ');
        } else if (this.size === ProfileSize.original) {
            return [
                `${this.baseUrl}${ProfileSize.w185}${this.profilePath} 185w`,
                `${this.baseUrl}${ProfileSize.w632}${this.profilePath} 632w`,
                `${this.baseUrl}${ProfileSize.original}${this.profilePath} 1000w`,
            ].join(', ');
        }
        return '';
    }

    @HostBinding('sizes') get imageSizes(): string {
        // Apply sizes for large and medium images
        if (this.size === ProfileSize.w632) {
            return '(max-width: 576px) 92px, (max-width: 1200px) 92px, (max-width: 1920px) 316px, 500px';
        } else if (this.size === ProfileSize.w185) {
            return '(max-width: 576px) 92px, (max-width: 1920px) 92px, 500px';
        } else if (this.size === ProfileSize.original) {
            return '(max-width: 576px) 92px, (max-width: 1200px) 92px, (max-width: 1920px) 316px, 500px';
        }
        return '';
    }
}
