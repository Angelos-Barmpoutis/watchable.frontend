import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntil } from 'rxjs';

import { POSTER_SIZE } from '../../core/enumerations/poster-size.enum';
import { DEFAULT } from '../../shared/constants/defaults.constant';
import { PosterPathDirective } from '../../shared/directives/poster-path.directive';
import { AllTvSeries, TvSeriesFacade } from '../../shared/facades/tv-series.facade';
import { BaseComponent } from '../../shared/helpers/base.component';
import { LimitToPipe } from '../../shared/pipes/limit-to.pipe';

@Component({
    selector: 'app-tv-series',
    standalone: true,
    providers: [],
    templateUrl: './tv-series.component.html',
    styleUrl: './tv-series.component.scss',
    imports: [CommonModule, PosterPathDirective, LimitToPipe, RouterLink],
})
export class TvSeriesComponent extends BaseComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.mediumPosterSize;
    public posterFallback = DEFAULT.mediumPosterFallback;
    public allTvSeries!: AllTvSeries;

    constructor(private tvSeriesFacade: TvSeriesFacade) {
        super();
    }

    ngOnInit(): void {
        this.getAllTvSeries();
    }

    private getAllTvSeries(): void {
        this.tvSeriesFacade
            .getAllTvSeries()
            .pipe(takeUntil(this.destroyed))
            .subscribe((allTvSeries) => {
                this.allTvSeries = allTvSeries;
            });
    }
}
