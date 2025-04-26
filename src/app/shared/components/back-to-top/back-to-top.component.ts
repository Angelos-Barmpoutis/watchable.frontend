import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';

@Component({
    selector: 'app-back-to-top',
    standalone: true,
    imports: [CommonModule, FadeInDirective],
    templateUrl: './back-to-top.component.html',
    styleUrls: ['./back-to-top.component.scss'],
})
export class BackToTopComponent implements OnInit {
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
