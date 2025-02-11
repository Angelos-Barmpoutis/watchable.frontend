import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TuiRoot } from '@taiga-ui/core';

import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, HttpClientModule, CommonModule, HeaderComponent, FooterComponent, TuiRoot],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    isPageLoading!: boolean;

    constructor() {}
}
