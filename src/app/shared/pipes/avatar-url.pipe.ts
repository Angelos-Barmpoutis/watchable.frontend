import { Pipe, PipeTransform } from '@angular/core';

/**
 * Avatar URL pipe for generating complete TMDB image URLs
 * Transforms avatar paths into full TMDB image URLs or handles special cases
 */
@Pipe({
    name: 'avatarUrl',
    standalone: true,
})
export class AvatarUrlPipe implements PipeTransform {
    /**
     * Transforms avatar path into complete TMDB image URL
     * @param avatarPath - The avatar path from TMDB API (can be null/undefined)
     * @returns Complete image URL or empty string if no path provided
     * @example
     * ```typescript
     * "/path/to/avatar.jpg" -> "https://image.tmdb.org/t/p/w45/path/to/avatar.jpg"
     * "/https://external.com/image.jpg" -> "https://external.com/image.jpg"
     * null -> ""
     * undefined -> ""
     * ```
     */
    transform(avatarPath: string | null | undefined): string {
        if (!avatarPath) return '';

        if (avatarPath.startsWith('/https://')) {
            return avatarPath.substring(1);
        }

        return `https://image.tmdb.org/t/p/w45${avatarPath}`;
    }
}
