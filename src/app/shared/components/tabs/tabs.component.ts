import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { ButtonType } from '../button/enumerations/button-type.enum';

export interface TabItem<T> {
    id: number;
    value: T;
    label: string;
    icon?: {
        name: string;
        isLeft?: boolean;
    };
}

@Component({
    standalone: true,
    selector: 'app-tabs',
    imports: [CommonModule, FadeInDirective],
    templateUrl: './tabs.component.html',
    styleUrl: './tabs.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent<T = unknown> {
    @Input() isLoading = false;
    @Input() tabs: Array<TabItem<T>> = [];
    @Input() selectedTabId = DEFAULT.selectedTabId;
    @Output() tabChange = new EventEmitter<T>();

    readonly ButtonType = ButtonType;

    selectTab(value: T): void {
        if (this.isLoading) {
            return;
        }

        if (this.selectedTabId !== value) {
            this.selectedTabId = this.tabs.find((tab) => tab.value === value)?.id ?? DEFAULT.selectedTabId;
            this.tabChange.emit(value);
        }
    }
}
