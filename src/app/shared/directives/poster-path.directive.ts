import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
    selector: '[appPosterPath]',
    standalone: true,
})
export class PosterPathDirective {
    @Input() posterPath: string = '';
    @Input() baseUrl: string = 'https://image.tmdb.org/t/p/';
    @Input() size: string = 'original';

    @HostBinding('src') get imageUrl(): string {
        return `${this.baseUrl}${this.size}${this.posterPath}`;
    }
}
