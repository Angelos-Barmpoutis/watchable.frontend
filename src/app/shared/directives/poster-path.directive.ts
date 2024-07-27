import { Directive, HostBinding, Input } from '@angular/core';

import { POSTER_SIZE } from '../../core/enumerations/poster-size.enum';

@Directive({
    selector: '[appPosterPath]',
    standalone: true,
})
export class PosterPathDirective {
    @Input() posterPath: string = '';
    @Input() baseUrl: string = 'https://image.tmdb.org/t/p/';
    @Input() size: POSTER_SIZE = POSTER_SIZE.original;

    @HostBinding('src') get imageUrl(): string {
        return `${this.baseUrl}${this.size}${this.posterPath}`;
    }
}
