import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FadeInDirective } from '../../directives/fade-in.directive';
import { ButtonType } from './enumerations/button-type.enum';
import { ButtonLink } from './models/button.model';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, FadeInDirective],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
    @Input() type: HTMLButtonElement['type'] = 'button';
    @Input() variant: ButtonType = ButtonType.Primary;
    @Input() isLoading: boolean = false;
    @Input() routerLinkActive: string = '';
    @Input() disabled: boolean = false;
    @Input() isIconLeft: boolean = true;
    @Input() hasBorder: boolean = true;
    @Input() hasPadding: boolean = true;
    @Input() text?: string;
    @Input() icon?: string;
    @Input() link?: ButtonLink;
    readonly ButtonType = ButtonType;
}
