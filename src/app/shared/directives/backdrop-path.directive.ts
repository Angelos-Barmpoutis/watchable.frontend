import { Directive, HostBinding, Input } from '@angular/core';

import { environment } from '../../../environments/environment';
import { BACKDROP_SIZE } from '../../core/enumerations/backdrop-size.enum';

@Directive({
    selector: '[appBackdropPath]',
    standalone: true,
})
export class BackdropPathDirective {
    @Input() backdropPath: string = '';
    @Input() baseUrl: string = environment.imageBaseUrl;
    @Input() size: BACKDROP_SIZE = BACKDROP_SIZE.original;

    @HostBinding('src') get imageUrl(): string {
        return `${this.baseUrl}${this.size}${this.backdropPath}`;
    }
}
