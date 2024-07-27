import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./trending.component').then((c) => c.TrendingComponent),
    },
    {
        path: 'movies',
        loadComponent: () => import('./pages/movies/movies.component').then((c) => c.TrendingMoviesComponent),
    },
    {
        path: 'series',
        loadComponent: () => import('./pages/tv-series/tv-series.component').then((c) => c.TrendingTvSeriesComponent),
    },
    {
        path: 'people',
        loadComponent: () => import('./pages/people/people.component').then((c) => c.TrendingPeopleComponent),
    },
];
