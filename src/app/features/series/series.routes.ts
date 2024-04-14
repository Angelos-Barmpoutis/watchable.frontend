import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./series.component').then((c) => c.SeriesComponent),
    },
    {
        path: 'serie/:id',
        loadComponent: () => import('./pages/serie/serie.component').then((c) => c.SerieComponent),
    },
    {
        path: 'airing-today',
        loadComponent: () => import('./pages/airing-today/airing-today.component').then((c) => c.AiringTodayComponent),
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
];
