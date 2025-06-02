import { Routes } from '@angular/router';

import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./features/trending/trending.routes').then((m) => m.routes),
    },
    {
        path: 'movies',
        loadChildren: () => import('./features/movies/movies.routes').then((m) => m.routes),
    },
    {
        path: 'tv-shows',
        loadChildren: () => import('./features/tv-shows/tv-shows.routes').then((m) => m.routes),
    },
    {
        path: 'people',
        loadChildren: () => import('./features/people/people.routes').then((m) => m.routes),
    },
    {
        path: 'search',
        loadComponent: () => import('./features/search/search.component').then((c) => c.SearchComponent),
    },
    {
        path: 'watchlist',
        loadComponent: () => import('./features/watchlist/watchlist.component').then((c) => c.WatchlistComponent),
        canActivate: [authGuard],
    },
    {
        path: 'ratings',
        loadComponent: () => import('./features/ratings/ratings.component').then((c) => c.RatingsComponent),
        canActivate: [authGuard],
    },
    {
        path: '**',
        redirectTo: '/',
    },
];
