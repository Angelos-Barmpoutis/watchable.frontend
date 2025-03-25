import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appHideOnScroll]',
    standalone: true,
})
export class HideOnScrollDirective {
    private lastScrollTop = 0;
    private headerHeight: number;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {
        this.headerHeight = this.el.nativeElement.offsetHeight;
        console.log(this.headerHeight);
        // Initially show the header
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        console.log('ok');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Scrolling down
        if (scrollTop > this.lastScrollTop && scrollTop > this.headerHeight) {
            this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(-100%)');
        }
        // Scrolling up
        else if (scrollTop < this.lastScrollTop) {
            this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
        }

        this.lastScrollTop = scrollTop;
    }
}
