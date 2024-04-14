import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./movies.component').then((c) => c.MoviesComponent),
    },
    {
        path: 'movie/:id',
        loadComponent: () => import('./pages/movie/movie.component').then((c) => c.MovieComponent),
    },
    {
        path: 'now-playing',
        loadComponent: () => import('./pages/now-playing/now-playing.component').then((c) => c.NowPlayingComponent),
    },
    {
        path: 'popular',
        loadComponent: () => import('./pages/popular/popular.component').then((c) => c.PopularComponent),
    },
    {
        path: 'top-rated',
        loadComponent: () => import('./pages/top-rated/top-rated.component').then((c) => c.TopRatedComponent),
    },
    {
        path: 'trending',
        loadComponent: () => import('./pages/trending/trending.component').then((c) => c.TrendingComponent),
    },
    {
        path: 'upcoming',
        loadComponent: () => import('./pages/upcoming/upcoming.component').then((c) => c.UpcomingComponent),
    },
];
