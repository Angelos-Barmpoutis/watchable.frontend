import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatNumberWithK',
    standalone: true,
})
export class FormatNumberWithKPipe implements PipeTransform {
    transform(value: number): string {
        if (!value) return '0';

        if (value >= 1000) {
            return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }

        return value.toString();
    }
}
