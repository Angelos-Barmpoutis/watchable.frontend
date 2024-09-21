import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'time',
    standalone: true,
})
export class TimePipe implements PipeTransform {
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
