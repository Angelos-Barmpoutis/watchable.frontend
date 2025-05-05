import { ChangeDetectorRef, Directive, HostBinding, Input, OnInit } from '@angular/core';

import { environment } from '../../../environments/environment';
import { BackdropSize } from '../enumerations/backdrop-size.enum';
import { ScreenSize, ScreenSizeService } from '../services/screen-size.service';

@Directive({
    selector: '[appBackdropPath]',
    standalone: true,
})
export class BackdropPathDirective implements OnInit {
    @Input() backdropPath!: string;
    @Input() baseUrl: string = environment.imageBaseUrl;
    @Input() size: BackdropSize = BackdropSize.w1280;

    constructor(
        private cdr: ChangeDetectorRef,
        private screenSizeService: ScreenSizeService,
    ) {}

    ngOnInit(): void {
        if (!this.backdropPath) return;

        this.screenSizeService.currentSize$.subscribe((size) => {
            switch (true) {
                case size === ScreenSize.XSmall:
                    if (this.size === BackdropSize.w1280 || this.size === BackdropSize.original) {
                        this.size = BackdropSize.w780;
                    }
                    break;
                case size === ScreenSize.Small:
                    if (
                        this.size === BackdropSize.w780 ||
                        this.size === BackdropSize.w1280 ||
                        this.size === BackdropSize.original
                    ) {
                        this.size = BackdropSize.w780;
                    }
                    break;
                case size === ScreenSize.Medium:
                    if (
                        this.size === BackdropSize.w780 ||
                        this.size === BackdropSize.w1280 ||
                        this.size === BackdropSize.original
                    ) {
                        this.size = BackdropSize.w780;
                    }
                    break;
                case size === ScreenSize.Large:
                    if (
                        this.size === BackdropSize.w780 ||
                        this.size === BackdropSize.w1280 ||
                        this.size === BackdropSize.original
                    ) {
                        this.size = BackdropSize.w1280;
                    }
                    break;
                case size === ScreenSize.XLarge:
                    if (
                        this.size === BackdropSize.w780 ||
                        this.size === BackdropSize.w1280 ||
                        this.size === BackdropSize.original
                    ) {
                        this.size = BackdropSize.original;
                    }
                    break;
                default:
                    this.size = BackdropSize.original;
            }
            this.cdr.detectChanges();
        });
    }

    @HostBinding('src') get imageUrl(): string {
        return `${this.baseUrl}${this.size}${this.backdropPath}`;
    }
}
