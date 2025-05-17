import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Type } from '@angular/core';

import { DialogComponent } from '../components/dialog/dialog.component';

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    private overlayRef: OverlayRef | null = null;

    constructor(private overlay: Overlay) {}

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
        dialogRef.instance.data = data;
    }

    close(): void {
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
    }
}
