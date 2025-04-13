import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'avatarUrl',
    standalone: true,
})
export class AvatarUrlPipe implements PipeTransform {
    transform(avatarPath: string | null | undefined): string {
        if (!avatarPath) return '';

        if (avatarPath.startsWith('/https://')) {
            return avatarPath.substring(1);
        }

        return `https://image.tmdb.org/t/p/w45${avatarPath}`;
    }
}
