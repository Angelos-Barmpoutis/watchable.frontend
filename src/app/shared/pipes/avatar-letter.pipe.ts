import { Pipe, PipeTransform } from '@angular/core';

/**
 * Avatar letter pipe for generating initial letters from names
 * Extracts and capitalizes the first letter of a string for avatar placeholders
 */
@Pipe({
    name: 'avatarLetter',
    standalone: true,
})
export class AvatarLetterPipe implements PipeTransform {
    /**
     * Transforms a string into its first letter in uppercase for avatar display
     * @param value - The string to extract the first letter from
     * @returns The first letter in uppercase or the original value if empty
     * @example
     * ```typescript
     * "John Doe" -> "J"
     * "mary" -> "M"
     * "123abc" -> "1"
     * "" -> ""
     * null -> null
     * ```
     */
    transform(value: string): string {
        if (!value) {
            return value;
        }
        return value.split('')[0].toUpperCase();
    }
}
