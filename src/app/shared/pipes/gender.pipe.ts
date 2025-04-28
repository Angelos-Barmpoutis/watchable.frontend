import { Pipe, PipeTransform } from '@angular/core';

import { Gender } from '../enumerations/gender.enum';

@Pipe({
    name: 'gender',
    standalone: true,
})
export class GenderPipe implements PipeTransform {
    transform(value: number): string {
        return Gender[value] || 'Unknown';
    }
}
