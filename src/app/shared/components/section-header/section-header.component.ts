// section-header.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FadeInDirective } from '../../directives/fade-in.directive';

@Component({
    selector: 'app-section-header',
    templateUrl: './section-header.component.html',
    styleUrls: ['./section-header.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, FadeInDirective],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeaderComponent {
    @Input() title: string = '';
    @Input() redirectUrl: string | Array<string> | null | undefined;
}
