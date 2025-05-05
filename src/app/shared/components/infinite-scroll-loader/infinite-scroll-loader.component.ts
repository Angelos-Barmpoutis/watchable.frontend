import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

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

    private observer: IntersectionObserver | null = null;

    constructor(private element: ElementRef) {}

    ngOnInit(): void {
        this.initObserver();
    }

    ngOnDestroy(): void {
        this.destroyObserver();
    }

    private initObserver(): void {
        if (typeof IntersectionObserver === 'undefined') {
            return;
        }

        const options = {
            root: null,
            rootMargin: '400px',
            threshold: 0.5,
        };

        this.observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !this.disabled) {
                this.scrolled.emit();
            }
        }, options);

        this.observer.observe(this.element.nativeElement as Element);
    }

    private destroyObserver(): void {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }
}
