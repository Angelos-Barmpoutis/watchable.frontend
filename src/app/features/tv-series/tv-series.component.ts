import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../shared/constants/defaults.constant';
import { PosterPathDirective } from '../../shared/directives/poster-path.directive';
import { POSTER_SIZE } from '../../shared/enumerations/poster-size.enum';
import { AllTvSeries, TvSeriesFacade } from '../../shared/facades/tv-series.facade';
import { LimitToPipe } from '../../shared/pipes/limit-to.pipe';

@Component({
    selector: 'app-tv-series',
    standalone: true,
    providers: [],
    templateUrl: './tv-series.component.html',
    styleUrl: './tv-series.component.scss',
    imports: [CommonModule, PosterPathDirective, LimitToPipe, RouterLink],
})
export class TvSeriesComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.mediumPosterSize;
    public posterFallback = DEFAULT.mediumPosterFallback;
    public allTvSeries!: AllTvSeries;

    constructor(
        private tvSeriesFacade: TvSeriesFacade,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.getAllTvSeries();
    }

    private getAllTvSeries(): void {
        this.tvSeriesFacade
            .getAllTvSeries()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((allTvSeries) => {
                this.allTvSeries = allTvSeries;
            });
    }
}
