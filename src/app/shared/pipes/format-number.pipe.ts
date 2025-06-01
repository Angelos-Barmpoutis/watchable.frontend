import { Pipe, PipeTransform } from '@angular/core';

/**
 * Number formatting pipe for displaying large numbers with K suffix
 * Transforms numbers >= 1000 into compact format with K notation
 */
@Pipe({
    name: 'formatNumberWithK',
    standalone: true,
})
export class FormatNumberWithKPipe implements PipeTransform {
    /**
     * Transforms numbers into compact format with K suffix for thousands
     * @param value - The number to format
     * @returns Formatted number string with K suffix or original number as string
     * @example
     * ```typescript
     * 1500 -> "1.5K"
     * 2000 -> "2K"
     * 999 -> "999"
     * 0 -> "0"
     * ```
     */
    transform(value: number): string {
        if (!value) return '0';

        if (value >= 1000) {
            return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }

        return value.toString();
    }
}
