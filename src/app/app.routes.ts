import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'trending',
        pathMatch: 'full',
    },
    {
        path: 'trending',
        loadChildren: () => import('./features/trending/trending.routes').then((m) => m.routes),
    },
    {
        path: 'movies',
        loadChildren: () => import('./features/movies/movies.routes').then((m) => m.routes),
    },
    {
        path: 'series',
        loadChildren: () => import('./features/tv-series/tv-series.routes').then((m) => m.routes),
    },
    {
        path: 'people',
        loadChildren: () => import('./features/people/people.routes').then((m) => m.routes),
    },
    {
        path: '**',
        redirectTo: '/',
    },
];
