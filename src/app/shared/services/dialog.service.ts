import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Type } from '@angular/core';

import { DialogComponent } from '../components/dialog/dialog.component';

/**
 * Dialog service for creating modal overlays with dynamic components
 * Manages overlay creation, positioning, and lifecycle
 */
@Injectable({
    providedIn: 'root',
})
export class DialogService {
    private overlayRef: OverlayRef | null = null;

    constructor(private overlay: Overlay) {}

    /**
     * Opens a modal dialog with the specified component
     * @param component - The component type to render inside the dialog
     * @param data - Optional data to pass to the dialog component
     * @template T - Type of the component being opened
     */
    open<T>(component: Type<T>, data?: unknown): void {
        const defaultConfig: OverlayConfig = {
            hasBackdrop: true,
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
        };

        this.overlayRef = this.overlay.create(defaultConfig);

        const dialogPortal = new ComponentPortal(DialogComponent);
        const dialogRef = this.overlayRef.attach(dialogPortal);

        dialogRef.instance.contentComponent = component;
        dialogRef.instance.data = (data as Record<string, unknown>) || {};
    }

    /**
     * Closes the currently open dialog and cleans up overlay resources
     */
    close(): void {
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
    }
}
