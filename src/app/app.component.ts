import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { takeUntil } from 'rxjs';

import { PageLoaderService } from './core/services/page-loader.service';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { PageLoaderComponent } from './shared/components/page-loader/page-loader.component';
import { BaseComponent } from './shared/helpers/base.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, HttpClientModule, CommonModule, HeaderComponent, FooterComponent, PageLoaderComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent extends BaseComponent {
    isPageLoading!: boolean;

    constructor(private loaderService: PageLoaderService) {
        super();

        this.loaderService.loading$.pipe(takeUntil(this.destroyed)).subscribe((isLoading) => {
            this.isPageLoading = isLoading;
        });
    }
}
