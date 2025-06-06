import { CommonModule } from '@angular/common';
import {
    Component,
    ComponentRef,
    EnvironmentInjector,
    OnDestroy,
    OnInit,
    Type,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';

import { DialogService } from '../../services/dialog.service';

@Component({
    standalone: true,
    selector: 'app-dialog',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit, OnDestroy {
    @ViewChild('contentContainer', { read: ViewContainerRef, static: true })
    contentContainer!: ViewContainerRef;

    contentComponent!: Type<unknown>;
    data: Record<string, unknown> = {};
    private contentComponentRef: ComponentRef<unknown> | null = null;

    constructor(
        private dialogService: DialogService,
        private environmentInjector: EnvironmentInjector,
    ) {}

    ngOnInit(): void {
        this.contentContainer.clear();
        this.contentComponentRef = this.contentContainer.createComponent(this.contentComponent, {
            environmentInjector: this.environmentInjector,
        });

        if (this.data) {
            Object.assign(this.contentComponentRef.instance as Record<string, unknown>, this.data);
        }
    }

    ngOnDestroy(): void {
        if (this.contentComponentRef) {
            this.contentComponentRef.destroy();
        }
    }

    close(): void {
        this.dialogService.close();
    }

    onOverlayClick(): void {
        this.close();
    }
}
