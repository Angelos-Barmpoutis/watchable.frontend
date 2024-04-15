import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
    selector: '[appBackdropPath]',
    standalone: true,
})
export class BackdropPathDirective {
    @Input() backdropPath: string = '';
    @Input() baseUrl: string = 'https://image.tmdb.org/t/p/';
    @Input() size: string = 'original';

    @HostBinding('src') get imageUrl(): string {
        return `${this.baseUrl}${this.size}${this.backdropPath}`;
    }
}
