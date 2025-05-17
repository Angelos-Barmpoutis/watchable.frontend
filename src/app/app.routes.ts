import { Routes } from '@angular/router';

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
        path: 'auth-callback',
        loadComponent: () =>
            import('./features/auth/auth-callback/auth-callback.component').then((c) => c.AuthCallbackComponent),
        title: 'Authentication',
    },
    {
        path: '**',
        redirectTo: '/',
    },
];
