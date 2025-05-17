import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthFacade } from '../../../shared/facades/auth.facade';

@Component({
    selector: 'app-auth-callback',
    template: '<div>Processing authentication...</div>',
    standalone: true,
})
export class AuthCallbackComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private authFacade: AuthFacade,
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            const requestToken = params['request_token'];
            const approved = params['approved'];

            if (approved === 'true' && requestToken) {
                // Notify the opener window that authentication is complete with the request token
                if (window.opener) {
                    window.opener.postMessage(
                        {
                            type: 'AUTH_SUCCESS',
                            requestToken: requestToken,
                        },
                        window.location.origin,
                    );
                }
                window.close();
            } else {
                window.close();
            }
        });
    }
}
