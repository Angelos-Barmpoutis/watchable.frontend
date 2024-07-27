import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'limitTo',
    standalone: true,
})
export class LimitToPipe implements PipeTransform {
    transform<T>(items: Array<T>, limit: number): Array<T> {
        if (!items) {
            return [];
        }
        return items.slice(0, limit);
    }
}
