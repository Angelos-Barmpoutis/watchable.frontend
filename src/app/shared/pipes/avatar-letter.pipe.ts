import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'avatarLetter',
    standalone: true,
})
export class AvatarLetterPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) {
            return value;
        }
        return value.split('')[0].toUpperCase();
    }
}
