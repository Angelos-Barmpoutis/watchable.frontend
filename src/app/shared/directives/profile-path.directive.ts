import { Directive, HostBinding, Input } from '@angular/core';

import { PROFILE_SIZE } from '../../core/enumerations/profile-size.enum';

@Directive({
    selector: '[appProfilePath]',
    standalone: true,
})
export class ProfilePathDirective {
    @Input() profilePath: string = '';
    @Input() baseUrl: string = 'https://image.tmdb.org/t/p/';
    @Input() size: PROFILE_SIZE = PROFILE_SIZE.original;

    @HostBinding('src') get imageUrl(): string {
        return `${this.baseUrl}${this.size}${this.profilePath}`;
    }
}
