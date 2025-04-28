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
}
