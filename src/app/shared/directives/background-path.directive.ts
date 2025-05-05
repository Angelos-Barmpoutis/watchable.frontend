import { Directive, HostBinding, Input } from '@angular/core';

import { environment } from '../../../environments/environment';
import { BackdropSize } from '../enumerations/backdrop-size.enum';

@Directive({
    selector: '[appBackgroundPath]',
    standalone: true,
})
export class BackgroundPathDirective {
    @Input() backgroundPath!: string;
    @Input() baseUrl: string = environment.imageBaseUrl;
    @Input() size: BackdropSize = BackdropSize.w1280;

    @HostBinding('style.background-image')
    get backgroundImage(): string {
        return `url('${this.baseUrl}${this.size}${this.backgroundPath}')`;
    }
}
