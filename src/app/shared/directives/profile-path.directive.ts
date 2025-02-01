import { Directive, HostBinding, Input } from '@angular/core';

import { environment } from '../../../environments/environment';
import { PROFILE_SIZE } from '../enumerations/profile-size.enum';

@Directive({
    selector: '[appProfilePath]',
    standalone: true,
})
export class ProfilePathDirective {
    @Input() profilePath: string = '';
    @Input() baseUrl: string = environment.imageBaseUrl;
    @Input() size: PROFILE_SIZE = PROFILE_SIZE.original;

    @HostBinding('src') get imageUrl(): string {
        return `${this.baseUrl}${this.size}${this.profilePath}`;
    }
}
