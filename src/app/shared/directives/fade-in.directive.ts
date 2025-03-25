import { animate, AnimationBuilder, style } from '@angular/animations';
import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
    selector: '[appFadeIn]',
    standalone: true,
})
export class FadeInDirective implements OnInit {
    constructor(
        private elementRef: ElementRef,
        private animationBuilder: AnimationBuilder,
    ) {}

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
