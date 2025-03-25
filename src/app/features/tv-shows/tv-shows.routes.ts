import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./tv-shows.component').then((c) => c.TvShowsComponent),
    },
    {
        path: 'tv-show/:id',
        loadComponent: () => import('./pages/tv-show/tv-show.component').then((c) => c.TvShowComponent),
    },
    {
        path: 'discover/:genre',
        loadComponent: () => import('./pages/discover/discover.component').then((c) => c.DiscoverTvShowsComponent),
    },
    {
        path: 'airing-today',
        loadComponent: () =>
            import('./pages/airing-today/airing-today.component').then((c) => c.AiringTodayTvShowsComponent),
    },
    {
        path: 'popular',
        loadComponent: () => import('./pages/popular/popular.component').then((c) => c.PopularTvShowsComponent),
    },
    {
        path: 'top-rated',
        loadComponent: () => import('./pages/top-rated/top-rated.component').then((c) => c.TopRatedTvShowsComponent),
    },
];
