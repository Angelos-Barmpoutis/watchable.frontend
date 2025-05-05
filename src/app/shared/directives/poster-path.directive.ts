import { ChangeDetectorRef, Directive, HostBinding, Input, OnInit } from '@angular/core';

import { environment } from '../../../environments/environment';
import { PosterSize } from '../enumerations/poster-size.enum';
import { ScreenSize, ScreenSizeService } from '../services/screen-size.service';

@Directive({
    selector: '[appPosterPath]',
    standalone: true,
})
export class PosterPathDirective implements OnInit {
    @Input() posterPath!: string;
    @Input() baseUrl: string = environment.imageBaseUrl;
    @Input() size: PosterSize = PosterSize.original;

    constructor(
        private cdr: ChangeDetectorRef,
        private screenSizeService: ScreenSizeService,
    ) {}

    ngOnInit(): void {
        if (!this.posterPath) return;

        this.screenSizeService.currentSize$.subscribe((size) => {
            switch (true) {
                case size === ScreenSize.XSmall:
                    if (this.size === PosterSize.w185) {
                        this.size = PosterSize.w92;
                    }
                    break;
                default:
                    this.size = PosterSize.original;
            }
            this.cdr.detectChanges();
        });
    }

    @HostBinding('src') get imageUrl(): string {
        return `${this.baseUrl}${this.size}${this.posterPath}`;
    }
}
