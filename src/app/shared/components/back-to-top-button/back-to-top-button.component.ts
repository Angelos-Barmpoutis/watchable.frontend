import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';

@Component({
    selector: 'app-back-to-top-button',
    standalone: true,
    imports: [CommonModule, FadeInDirective],
    templateUrl: './back-to-top-button.component.html',
    styleUrls: ['./back-to-top-button.component.scss'],
})
export class BackToTopButtonComponent implements OnInit {
    @HostListener('window:scroll')
    onWindowScroll(): void {
        this.checkScrollPosition();
    }

    private scrollThreshold = DEFAULT.scrollThreshold;
    showButton = false;

    ngOnInit(): void {
        this.checkScrollPosition();
    }

    private checkScrollPosition(): void {
        this.showButton = window.scrollY > this.scrollThreshold;
    }

    scrollToTop(): void {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }
}
