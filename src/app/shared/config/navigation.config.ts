export interface NavigationLink {
    path: string;
    title: string;
    icon: string;
}

export const NAVIGATION_LINKS: Array<NavigationLink> = [
    { path: '/movies', title: 'Movies', icon: 'fas fa-film' },
    { path: '/tv-shows', title: 'TV Shows', icon: 'fas fa-tv' },
    { path: '/people', title: 'People', icon: 'fa-solid fa-users' },
];
