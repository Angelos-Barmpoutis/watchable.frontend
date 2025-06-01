import { environment } from '../../../environments/environment';

/**
 * Detects if the current device is a mobile device
 */
export function isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Generates the TMDB authentication URL with redirect
 */
export function getAuthUrl(requestToken: string): string {
    const currentPath = window.location.pathname;
    return `${environment.TMDBAuthUrl}${requestToken}?redirect_to=${environment.origin}${currentPath}`;
}

/**
 * Handles mobile authentication flow with timeout protection
 */
export function handleMobileAuthRedirect(authUrl: string, timeoutCallback: () => void): void {
    // Add a safety timeout to prevent stuck loading states
    setTimeout(() => {
        timeoutCallback();
    }, 30000); // 30 second timeout

    // Use normal navigation so users can go back to the app
    window.location.replace(authUrl);
}

/**
 * Creates and manages a desktop authentication popup with timeout
 */
export function createAuthPopup(authUrl: string, onClose: () => void, onTimeout: () => void): Window | null {
    const popupWindow = window.open(authUrl, 'TMDB Authentication', 'width=800,height=600');

    if (!popupWindow) {
        return null;
    }

    // Add timeout for desktop popup
    const popupTimeout = setTimeout(() => {
        if (!popupWindow.closed) {
            popupWindow.close();
            onTimeout();
        }
    }, 300000); // 5 minute timeout for desktop

    // Monitor popup close
    const checkPopup = setInterval(() => {
        if (popupWindow.closed) {
            clearInterval(checkPopup);
            clearTimeout(popupTimeout);
            onClose();
        }
    }, 500);

    return popupWindow;
}
