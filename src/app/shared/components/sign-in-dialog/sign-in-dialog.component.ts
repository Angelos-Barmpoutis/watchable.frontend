import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-sign-in-dialog',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './sign-in-dialog.component.html',
    styleUrls: ['./sign-in-dialog.component.scss'],
})
export class SignInDialogComponent {
    email: string = '';
    password: string = '';

    onSubmit() {
        // TODO: Implement sign in logic
        console.log('Sign in attempt:', { email: this.email, password: this.password });
    }
}
