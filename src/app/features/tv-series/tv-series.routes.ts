import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./tv-series.component').then((c) => c.TvSeriesComponent),
    },
    {
        path: 'serie/:id',
        loadComponent: () => import('./pages/tv-serie/tv-serie.component').then((c) => c.TvSeriesTvSerieComponent),
    },
    {
        path: 'airing-today',
        loadComponent: () =>
            import('./pages/airing-today/airing-today.component').then((c) => c.TvSeriesAiringTodayComponent),
    },
    {
        path: 'popular',
        loadComponent: () => import('./pages/popular/popular.component').then((c) => c.TvSeriesPopularComponent),
    },
    {
        path: 'top-rated',
        loadComponent: () => import('./pages/top-rated/top-rated.component').then((c) => c.TvSeriesTopRatedComponent),
    },
];
