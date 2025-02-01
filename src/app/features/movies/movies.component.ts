import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { DEFAULT } from '../../shared/constants/defaults.constant';
import { PosterPathDirective } from '../../shared/directives/poster-path.directive';
import { POSTER_SIZE } from '../../shared/enumerations/poster-size.enum';
import { AllMovies, MoviesFacade } from '../../shared/facades/movies.facade';
import { LimitToPipe } from '../../shared/pipes/limit-to.pipe';

@Component({
    selector: 'app-movies',
    standalone: true,
    providers: [],
    templateUrl: './movies.component.html',
    styleUrl: './movies.component.scss',
    imports: [CommonModule, PosterPathDirective, LimitToPipe, RouterLink],
})
export class MoviesComponent implements OnInit {
    public posterSize: POSTER_SIZE = DEFAULT.mediumPosterSize;
    public posterFallback = DEFAULT.mediumPosterFallback;
    public allMovies!: AllMovies;

    constructor(
        private movieFacade: MoviesFacade,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.getAllMovies();
    }

    private getAllMovies(): void {
        this.movieFacade
            .getAllMovies()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((allMovies) => {
                this.allMovies = allMovies;
            });
    }
}
