import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-mobile-navigation',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './mobile-navigation.component.html',
    styleUrl: './mobile-navigation.component.scss',
})
export class MobileNavigationComponent implements OnInit {
    hasBottomBar = false;

    ngOnInit(): void {
        this.checkBottomBar();
    }

    @HostListener('window:resize')
    onResize(): void {
        this.checkBottomBar();
    }

    private checkBottomBar(): void {
        // Check if we're on a mobile device
        if (window.innerWidth <= 768) {
            // Check if there's a bottom bar by comparing viewport height with window height
            const viewportHeight = window.innerHeight;
            const windowHeight = window.outerHeight;

            // If there's a significant difference, it likely means there's a bottom bar
            this.hasBottomBar = windowHeight - viewportHeight > 50;
        } else {
            this.hasBottomBar = false;
        }
    }
}
