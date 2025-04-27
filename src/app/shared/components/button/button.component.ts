import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FadeInDirective } from '../../directives/fade-in.directive';
import { ButtonType } from '../../enumerations/components/button-type.enum';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, FadeInDirective],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
    @Input() type: ButtonType = ButtonType.Primary;
    @Input() isLoading: boolean = false;
    @Input() routerLink?: string | Array<string | number>;
    @Input() disabled: boolean = false;
    @Input() icon?: string;
    @Input() isIconLeft: boolean = true;
    @Input() text?: string;
    @Input() hasBorder: boolean = true;
    readonly ButtonType = ButtonType;
}
