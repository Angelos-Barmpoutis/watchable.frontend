import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-movies',
    standalone: true,
    providers: [],
    templateUrl: './people.component.html',
    styleUrl: './people.component.scss',
    imports: [CommonModule],
})
export class PeopleComponent {}
