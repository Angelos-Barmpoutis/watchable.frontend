import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./trending.component').then((c) => c.TrendingComponent),
    },
    {
        path: 'trending/movies',
        loadComponent: () => import('./pages/movies/movies.component').then((c) => c.TrendingMoviesComponent),
    },
    {
        path: 'trending/tv-shows',
        loadComponent: () => import('./pages/tv-shows/tv-shows.component').then((c) => c.TrendingTvShowsComponent),
    },
    {
        path: 'trending/people',
        loadComponent: () => import('./pages/people/people.component').then((c) => c.TrendingPeopleComponent),
    },
];
