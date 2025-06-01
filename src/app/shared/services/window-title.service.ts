import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

/**
 * Window title management service for dynamic page titles
 * Extends Angular's TitleStrategy to provide branded page titles
 */
@Injectable({
    providedIn: 'root',
})
export class WindowTitleService extends TitleStrategy {
    constructor(private readonly title: Title) {
        super();
    }

    /**
     * Updates the browser window title with Watchable branding
     * @param routerState - The current router state snapshot
     * @override
     */
    override updateTitle(routerState: RouterStateSnapshot): void {
        const title = this.buildTitle(routerState);

        if (title !== undefined) {
            this.title.setTitle(`Watchable | ${title}`);
        } else {
            this.title.setTitle('Watchable');
        }
    }
}
