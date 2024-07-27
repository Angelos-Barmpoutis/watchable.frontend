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
        path: 'now-playing',
        loadComponent: () =>
            import('./pages/now-playing/now-playing.component').then((c) => c.MoviesNowPlayingComponent),
    },
    {
        path: 'popular',
        loadComponent: () => import('./pages/popular/popular.component').then((c) => c.MoviesPopularComponent),
    },
    {
        path: 'top-rated',
        loadComponent: () => import('./pages/top-rated/top-rated.component').then((c) => c.MoviesTopRatedComponent),
    },
    {
        path: 'upcoming',
        loadComponent: () => import('./pages/upcoming/upcoming.component').then((c) => c.MoviesUpcomingComponent),
    },
];
