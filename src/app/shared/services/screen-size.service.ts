import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { DestroyRef, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum ScreenSize {
    XSmall = 'xsmall',
    Small = 'small',
    Medium = 'medium',
    Large = 'large',
    XLarge = 'xlarge',
}

@Injectable({
    providedIn: 'root',
})
export class ScreenSizeService {
    private currentSizeSubject = new BehaviorSubject<ScreenSize>(ScreenSize.Medium);
    currentSize$ = this.currentSizeSubject.asObservable();

    constructor(
        private breakpointObserver: BreakpointObserver,
        private destroyRef: DestroyRef,
    ) {
        this.breakpointObserver
            .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                map<BreakpointState, ScreenSize>((result) => {
                    switch (true) {
                        case result.breakpoints[Breakpoints.XSmall]:
                            return ScreenSize.XSmall;
                        case result.breakpoints[Breakpoints.Small]:
                            return ScreenSize.Small;
                        case result.breakpoints[Breakpoints.Medium]:
                            return ScreenSize.Medium;
                        case result.breakpoints[Breakpoints.Large]:
                            return ScreenSize.Large;
                        case result.breakpoints[Breakpoints.XLarge]:
                            return ScreenSize.XLarge;
                        default:
                            return ScreenSize.Medium;
                    }
                }),
            )
            .subscribe((size) => this.currentSizeSubject.next(size));
    }

    isMobile(): Observable<boolean> {
        return this.currentSize$.pipe(map((size) => size === ScreenSize.XSmall || size === ScreenSize.Small));
    }

    isTablet(): Observable<boolean> {
        return this.currentSize$.pipe(map((size) => size === ScreenSize.Medium));
    }

    isDesktop(): Observable<boolean> {
        return this.currentSize$.pipe(map((size) => size === ScreenSize.Large || size === ScreenSize.XLarge));
    }
}
