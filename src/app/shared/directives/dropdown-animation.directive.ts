import { animate, AnimationBuilder, style } from '@angular/animations';
import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
    selector: '[appDropdownAnimation]',
    standalone: true,
})
export class DropdownAnimationDirective implements OnInit {
    constructor(
        private elementRef: ElementRef,
        private animationBuilder: AnimationBuilder,
    ) {}

    ngOnInit(): void {
        const element: HTMLElement = this.elementRef.nativeElement as HTMLElement;

        const dropdownAnimation = this.animationBuilder.build([
            style({
                opacity: 0,
                scale: 0.9,
                transform: 'translateY(-10px)',
            }),
            animate(
                '300ms ease-out',
                style({
                    opacity: 1,
                    transform: 'translateY(0)',
                    scale: 1,
                }),
            ),
        ]);

        const player = dropdownAnimation.create(element);
        player.play();
    }
}
