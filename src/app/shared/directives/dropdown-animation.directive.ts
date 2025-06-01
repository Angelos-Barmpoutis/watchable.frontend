import { animate, AnimationBuilder, style } from '@angular/animations';
import { Directive, ElementRef, OnInit } from '@angular/core';

/**
 * Dropdown animation directive for smooth dropdown appearance
 * Applies scale and fade-in animation optimized for dropdown menus and overlays
 */
@Directive({
    selector: '[appDropdownAnimation]',
    standalone: true,
})
export class DropdownAnimationDirective implements OnInit {
    constructor(
        private elementRef: ElementRef,
        private animationBuilder: AnimationBuilder,
    ) {}

    /**
     * Initializes the dropdown animation on the host element
     * Animates opacity from 0 to 1 and scale from 0.85 to 1 over 200ms with ease-out timing
     */
    ngOnInit(): void {
        const element: HTMLElement = this.elementRef.nativeElement as HTMLElement;

        const dropdownAnimation = this.animationBuilder.build([
            style({
                opacity: 0,
                scale: 0.85,
            }),
            animate(
                '200ms ease-out',
                style({
                    opacity: 1,
                    scale: 1,
                }),
            ),
        ]);

        const player = dropdownAnimation.create(element);
        player.play();
    }
}
