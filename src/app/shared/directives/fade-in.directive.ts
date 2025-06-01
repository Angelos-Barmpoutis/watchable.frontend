import { animate, AnimationBuilder, style } from '@angular/animations';
import { Directive, ElementRef, OnInit } from '@angular/core';

/**
 * Fade-in animation directive for smooth element appearance
 * Automatically applies a fade-in animation when the element initializes
 */
@Directive({
    selector: '[appFadeIn]',
    standalone: true,
})
export class FadeInDirective implements OnInit {
    constructor(
        private elementRef: ElementRef,
        private animationBuilder: AnimationBuilder,
    ) {}

    /**
     * Initializes the fade-in animation on the host element
     * Animates from opacity 0 to 1 over 350ms with ease-in-out timing
     */
    ngOnInit(): void {
        const element: HTMLElement = this.elementRef.nativeElement as HTMLElement;

        const fadeIn = this.animationBuilder.build([
            style({ opacity: 0 }),
            animate('350ms ease-in-out', style({ opacity: 1 })),
        ]);

        const player = fadeIn.create(element);
        player.play();
    }
}
