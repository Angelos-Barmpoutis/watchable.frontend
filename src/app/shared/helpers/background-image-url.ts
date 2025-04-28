import { environment } from '../../../environments/environment';
import { BackdropSize } from '../enumerations/backdrop-size.enum';
import { PosterSize } from '../enumerations/poster-size.enum';
import { ProfileSize } from '../enumerations/profile-size.enum';

export function getBackgroundImageUrl(backdropSize: BackdropSize | ProfileSize | PosterSize, path: string): string {
    const imageBaseUrl = environment.imageBaseUrl;

    return `url(${imageBaseUrl}${backdropSize}${path})`;
}
