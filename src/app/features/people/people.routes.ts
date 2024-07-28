import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./people.component').then((c) => c.PeopleComponent),
    },
    {
        path: 'person/:id',
        loadComponent: () => import('./pages/person/person.component').then((c) => c.PeoplePersonComponent),
    },
    {
        path: 'popular',
        loadComponent: () => import('./pages/popular/popular.component').then((c) => c.PeoplePopularComponent),
    },
];
