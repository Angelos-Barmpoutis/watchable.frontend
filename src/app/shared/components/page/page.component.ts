import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FadeInDirective } from '../../directives/fade-in.directive';

@Component({
    selector: 'app-page',
    standalone: true,
    imports: [CommonModule, FadeInDirective],
    templateUrl: './page.component.html',
    styleUrl: './page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent {}
