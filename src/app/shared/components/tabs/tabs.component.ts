import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { ButtonType } from '../../enumerations/components/button-type.enum';
import { ButtonComponent } from '../button/button.component';

export interface TabItem<T> {
    id: number;
    value: T;
    label: string;
}

@Component({
    selector: 'app-tabs',
    standalone: true,
    imports: [CommonModule, FadeInDirective, ButtonComponent],
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
        if (this.selectedTabId !== value) {
            this.selectedTabId = this.tabs.find((tab) => tab.value === value)?.id ?? DEFAULT.selectedTabId;
            this.tabChange.emit(value);
        }
    }
}
