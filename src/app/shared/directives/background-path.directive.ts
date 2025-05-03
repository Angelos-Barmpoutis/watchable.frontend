import { Directive, HostBinding, Input } from '@angular/core';

import { environment } from '../../../environments/environment';
import { BackdropSize } from '../enumerations/backdrop-size.enum';

@Directive({
    selector: '[appBackgroundPath]',
    standalone: true,
})
export class BackgroundPathDirective {
    @Input() backgroundPath: string = '';
    @Input() baseUrl: string = environment.imageBaseUrl;

    @HostBinding('style.--background-image-780')
    get backgroundImage780(): string {
        return `url('${this.baseUrl}${BackdropSize.w780}${this.backgroundPath}')`;
    }

    @HostBinding('style.--background-image-1280')
    get backgroundImage1280(): string {
        return `url('${this.baseUrl}${BackdropSize.w1280}${this.backgroundPath}')`;
    }

    @HostBinding('style.--background-image-original')
    get backgroundImageOriginal(): string {
        return `url('${this.baseUrl}${BackdropSize.original}${this.backgroundPath}')`;
    }

    @HostBinding('style.background-size')
    get backgroundSize(): string {
        return 'cover';
    }

    @HostBinding('style.background-repeat')
    get backgroundRepeat(): string {
        return 'no-repeat';
    }
}
