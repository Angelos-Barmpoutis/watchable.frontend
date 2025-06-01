import { Pipe, PipeTransform } from '@angular/core';

/**
 * Time formatting pipe for converting minutes to hours and minutes display
 * Transforms numeric minutes into human-readable time format (e.g., "2h 30m")
 */
@Pipe({
    name: 'time',
    standalone: true,
})
export class TimePipe implements PipeTransform {
    /**
     * Transforms minutes into formatted time string
     * @param value - The number of minutes to format
     * @returns Formatted time string (e.g., "2h 30m", "45m", "1h") or empty string if invalid
     * @example
     * ```typescript
     * 150 -> "2h 30m"
     * 90 -> "1h 30m"
     * 45 -> "45m"
     * 60 -> "1h"
     * ```
     */
    transform(value: number): string {
        if (value === null || value === undefined || isNaN(value)) {
            return '';
        }

        const hours: number = Math.floor(value / 60);
        const minutes: number = value % 60;

        const hoursString = hours > 0 ? `${hours}h ` : '';
        const minutesString = minutes > 0 ? `${minutes}m` : '';

        return `${hoursString}${minutesString}`.trim();
    }
}
