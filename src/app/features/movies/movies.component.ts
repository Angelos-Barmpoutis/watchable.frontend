import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs';

import { PosterPathDirective } from '../../shared/directives/poster-path.directive';
import { AllMovies, MoviesFacade } from '../../shared/facades/movies.facade';
import { BaseComponent } from '../../shared/helpers/base.component';
import { LimitToPipe } from '../../shared/pipes/limit-to.pipe';

@Component({
    selector: 'app-movies',
    standalone: true,
    providers: [],
    templateUrl: './movies.component.html',
    styleUrl: './movies.component.scss',
    imports: [CommonModule, PosterPathDirective, ReactiveFormsModule, LimitToPipe],
})
export class MoviesComponent extends BaseComponent implements OnInit {
    public allMovies!: AllMovies;

    constructor(private movieFacade: MoviesFacade) {
        super();
    }

    ngOnInit(): void {
        this.getAllMovies();
    }

    private getAllMovies(): void {
        this.movieFacade
            .getAllMovies()
            .pipe(takeUntil(this.destroyed))
            .subscribe((allMovies) => {
                this.allMovies = allMovies;
            });
    }
}
