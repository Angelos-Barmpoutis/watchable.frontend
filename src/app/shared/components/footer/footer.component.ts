import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FadeInDirective } from '../../directives/fade-in.directive';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [RouterLink, FadeInDirective],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
