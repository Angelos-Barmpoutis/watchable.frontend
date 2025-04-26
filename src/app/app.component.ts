import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BehaviorSubject, forkJoin, take } from 'rxjs';

import { BackToTopComponent } from './shared/components/back-to-top/back-to-top.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { MobileNavigationComponent } from './shared/components/mobile-navigation/mobile-navigation.component';
import { GenreFacade } from './shared/facades/genre.facade';
import { Genre } from './shared/models/genre.model';
import { LocalStorageService } from './shared/services/local-storage.service';
import { SearchService } from './shared/services/search.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        HttpClientModule,
        CommonModule,
        HeaderComponent,
        MobileNavigationComponent,
        FooterComponent,
        BackToTopComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    isAppReady$ = new BehaviorSubject<boolean>(false);

    constructor(
        public searchService: SearchService,
        private localStorageService: LocalStorageService,
        private genresFacade: GenreFacade,
    ) {}

    ngOnInit(): void {
        this.initializeApp();
    }

    private initializeApp(): void {
        const storedMovieGenres = this.localStorageService.getItem<Array<Genre>>('movieGenres') ?? [];
        const storedTvShowGenres = this.localStorageService.getItem<Array<Genre>>('tvShowGenres') ?? [];

        if (storedMovieGenres.length > 0 && storedTvShowGenres?.length > 0) {
            this.isAppReady$.next(true);
        } else {
            forkJoin({
                movieGenres: this.genresFacade.getMovieGenres(),
                tvShowGenres: this.genresFacade.getTvShowGenres(),
            })
                .pipe(take(1))
                .subscribe((results) => {
                    if (!storedMovieGenres?.length) {
                        this.localStorageService.setItem<Array<Genre>>('movieGenres', results.movieGenres.genres);
                    }

                    if (!storedTvShowGenres?.length) {
                        this.localStorageService.setItem<Array<Genre>>('tvShowGenres', results.tvShowGenres.genres);
                    }

                    this.isAppReady$.next(true);
                });
        }
    }
}
