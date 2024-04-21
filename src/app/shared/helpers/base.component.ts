import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-base',
    standalone: true,
    template: '',
    styles: [],
})
export class BaseComponent implements OnDestroy {
    protected destroyed = new Subject<void>();

    ngOnDestroy(): void {
        this.destroyed.next();
        this.destroyed.complete();
    }
}
