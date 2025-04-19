import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-mobile-navigation',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './mobile-navigation.component.html',
    styleUrl: './mobile-navigation.component.scss',
})
export class MobileNavigationComponent {}
