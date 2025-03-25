import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-infinite-scroll-loader',
    standalone: true,
    imports: [],
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

        this.observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !this.disabled) {
                this.scrolled.emit();
            }
        });

        this.observer.observe(this.element.nativeElement as Element);
    }

    private destroyObserver(): void {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }
}
