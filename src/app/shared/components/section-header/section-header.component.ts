// section-header.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FadeInDirective } from '../../directives/fade-in.directive';
import { ButtonType } from '../../enumerations/components/button-type.enum';
import { ButtonComponent } from '../button/button.component';

@Component({
    selector: 'app-section-header',
    templateUrl: './section-header.component.html',
    styleUrls: ['./section-header.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, FadeInDirective, ButtonComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeaderComponent {
    @Input() title: string = '';
    @Input() redirectUrl: string | Array<string> | null | undefined;
    @Input() isLoading: boolean = false;

    readonly buttonType = ButtonType;
}
