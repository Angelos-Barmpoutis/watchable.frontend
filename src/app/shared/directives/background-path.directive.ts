import { ChangeDetectorRef, Directive, HostBinding, Input, OnInit } from '@angular/core';

import { environment } from '../../../environments/environment';
import { BackdropSize } from '../enumerations/backdrop-size.enum';
import { ScreenSize, ScreenSizeService } from '../services/screen-size.service';

@Directive({
    selector: '[appBackgroundPath]',
    standalone: true,
})
export class BackgroundPathDirective implements OnInit {
    @Input() backgroundPath!: string;
    @Input() baseUrl: string = environment.imageBaseUrl;
    @Input() size: BackdropSize = BackdropSize.w1280;

    constructor(
        private cdr: ChangeDetectorRef,
        private screenSizeService: ScreenSizeService,
    ) {}

    ngOnInit(): void {
        if (!this.backgroundPath) return;

        this.screenSizeService.currentSize$.subscribe((size) => {
            switch (true) {
                case size === ScreenSize.XSmall:
                    if (this.size === BackdropSize.w1280 || this.size === BackdropSize.original) {
                        this.size = BackdropSize.w1280;
                    }
                    break;
                case size === ScreenSize.Small:
                    if (this.size === BackdropSize.w780 || this.size === BackdropSize.original) {
                        this.size = BackdropSize.w1280;
                    }
                    break;
                case size === ScreenSize.Medium:
                    if (this.size === BackdropSize.w780 || this.size === BackdropSize.original) {
                        this.size = BackdropSize.w1280;
                    }
                    break;
                case size === ScreenSize.Large:
                    if (
                        this.size === BackdropSize.w780 ||
                        this.size === BackdropSize.w1280 ||
                        this.size === BackdropSize.original
                    ) {
                        this.size = BackdropSize.original;
                    }
                    break;
                case size === ScreenSize.XLarge:
                    if (this.size === BackdropSize.w780 || this.size === BackdropSize.w1280) {
                        this.size = BackdropSize.original;
                    }
                    break;
                default:
                    this.size = BackdropSize.original;
            }
            this.cdr.detectChanges();
        });
    }

    @HostBinding('style.background-image')
    get backgroundImage(): string {
        return `url('${this.baseUrl}${this.size}${this.backgroundPath}')`;
    }
}
