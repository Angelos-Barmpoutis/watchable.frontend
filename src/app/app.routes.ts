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
        title: 'Movies',
    },
    {
        path: 'tv-shows',
        loadChildren: () => import('./features/tv-shows/tv-shows.routes').then((m) => m.routes),
        title: 'TV Shows',
    },
    {
        path: 'people',
        loadChildren: () => import('./features/people/people.routes').then((m) => m.routes),
        title: 'People',
    },
    {
        path: 'search',
        loadComponent: () => import('./features/search/search.component').then((c) => c.SearchComponent),
        title: 'Search',
    },
    {
        path: 'watchlist',
        loadComponent: () => import('./features/watchlist/watchlist.component').then((c) => c.WatchlistComponent),
        title: 'My Watchlist',
        canActivate: [authGuard],
    },
    {
        path: '**',
        redirectTo: '/',
    },
];
