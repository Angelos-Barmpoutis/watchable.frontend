import { CommonModule } from '@angular/common';
import {
    Component,
    ComponentRef,
    createComponent,
    EnvironmentInjector,
    OnDestroy,
    OnInit,
    Type,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';

import { DialogService } from '../../services/dialog.service';

@Component({
    selector: 'app-dialog',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit, OnDestroy {
    @ViewChild('contentContainer', { read: ViewContainerRef, static: true })
    contentContainer!: ViewContainerRef;

    contentComponent!: Type<any>;
    data: any;
    private contentComponentRef: ComponentRef<any> | null = null;

    constructor(
        private dialogService: DialogService,
        private environmentInjector: EnvironmentInjector,
    ) {}

    ngOnInit(): void {
        if (this.contentComponent) {
            this.contentComponentRef = createComponent(this.contentComponent, {
                environmentInjector: this.environmentInjector,
                elementInjector: this.contentContainer.injector,
            });

            if (this.data) {
                Object.assign(this.contentComponentRef.instance, this.data);
            }

            this.contentContainer.insert(this.contentComponentRef.hostView);
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
