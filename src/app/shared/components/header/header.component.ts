import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink, SearchBarComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {}
