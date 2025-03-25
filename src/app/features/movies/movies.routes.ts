import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./movies.component').then((c) => c.MoviesComponent),
    },
    {
        path: 'movie/:id',
        loadComponent: () => import('./pages/movie/movie.component').then((c) => c.MoviesMovieComponent),
    },
    {
        path: 'discover/:genre',
        loadComponent: () => import('./pages/discover/discover.component').then((c) => c.DiscoverMoviesComponent),
    },
    {
        path: 'now-playing',
        loadComponent: () =>
            import('./pages/now-playing/now-playing.component').then((c) => c.NowPlayingMoviesComponent),
    },
    {
        path: 'popular',
        loadComponent: () => import('./pages/popular/popular.component').then((c) => c.PopularMoviesComponent),
    },
    {
        path: 'top-rated',
        loadComponent: () => import('./pages/top-rated/top-rated.component').then((c) => c.TopRatedMoviesComponent),
    },
    {
        path: 'upcoming',
        loadComponent: () => import('./pages/upcoming/upcoming.component').then((c) => c.UpcomingMoviesComponent),
    },
];
