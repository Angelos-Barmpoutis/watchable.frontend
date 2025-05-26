import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';

@Component({
    selector: 'app-infinite-scroll-loader',
    standalone: true,
    imports: [CommonModule, FadeInDirective],
    templateUrl: './infinite-scroll-loader.component.html',
    styleUrl: './infinite-scroll-loader.component.scss',
})
export class InfiniteScrollLoaderComponent implements OnInit, OnDestroy {
    @Input() disabled: boolean = false;
    @Output() scrolled = new EventEmitter<void>();

    private lastScrollTop = 0;
    private scrollThreshold = DEFAULT.infiniteScrollThreshold;
    private scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    ngOnInit(): void {
        this.checkScroll();
    }

    ngOnDestroy(): void {
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
    }

    @HostListener('window:scroll', ['$event'])
    onScroll(): void {
        if (this.disabled) return;

        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }

        this.scrollTimeout = setTimeout(() => {
            this.checkScroll();
        }, 100);
    }

    private checkScroll(): void {
        if (this.disabled) return;

        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
        const distanceFromBottom = documentHeight - scrollPosition;

        if (distanceFromBottom < this.scrollThreshold && window.scrollY > this.lastScrollTop) {
            this.scrolled.emit();
        }

        this.lastScrollTop = window.scrollY;
    }
}
