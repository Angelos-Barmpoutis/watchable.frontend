import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FadeInDirective } from '../../directives/fade-in.directive';

@Component({
    standalone: true,
    selector: 'app-footer',
    imports: [FadeInDirective],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
