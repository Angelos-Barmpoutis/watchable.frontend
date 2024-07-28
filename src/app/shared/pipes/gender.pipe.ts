import { Pipe, PipeTransform } from '@angular/core';

import { GENDER } from '../../core/enumerations/gender.enum';

@Pipe({
    name: 'gender',
    standalone: true,
})
export class GenderPipe implements PipeTransform {
    transform(value: number): string {
        return GENDER[value] || 'Unknown';
    }
}
