import { Pipe, PipeTransform } from '@angular/core';

import { Gender } from '../enumerations/gender.enum';

/**
 * Gender formatting pipe for converting numeric gender codes to readable strings
 * Transforms TMDB gender codes into human-readable gender labels
 */
@Pipe({
    name: 'gender',
    standalone: true,
})
export class GenderPipe implements PipeTransform {
    /**
     * Transforms numeric gender code into readable gender string
     * @param value - The numeric gender code from TMDB API
     * @returns Human-readable gender string or "Unknown" if not found
     * @example
     * ```typescript
     * 1 -> "Female"
     * 2 -> "Male"
     * 0 -> "Not specified"
     * 99 -> "Unknown"
     * ```
     */
    transform(value: number): string {
        return Gender[value] || 'Unknown';
    }
}
