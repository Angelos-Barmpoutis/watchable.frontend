import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
    PreloadAllModules,
    provideRouter,
    TitleStrategy,
    withInMemoryScrolling,
    withPreloading,
    withViewTransitions,
} from '@angular/router';
import { register } from 'swiper/element';

import { routes } from './app.routes';
import { InterceptorService } from './shared/services/interceptor.service';
import { TitleService } from './shared/services/title.service';

register();

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideRouter(
            routes,
            withViewTransitions(),
            withPreloading(PreloadAllModules),
            withInMemoryScrolling({
                scrollPositionRestoration: 'top',
                anchorScrolling: 'enabled',
            }),
        ),
        { provide: TitleStrategy, useClass: TitleService },
        provideHttpClient(withInterceptorsFromDi()),
        { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    ],
};
