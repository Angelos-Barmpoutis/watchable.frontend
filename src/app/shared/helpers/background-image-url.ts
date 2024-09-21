import { environment } from '../../../environments/environment';
import { BACKDROP_SIZE } from '../../core/enumerations/backdrop-size.enum';
import { POSTER_SIZE } from '../../core/enumerations/poster-size.enum';
import { PROFILE_SIZE } from '../../core/enumerations/profile-size.enum';

export function getBackgroundImageUrl(backdropSize: BACKDROP_SIZE | PROFILE_SIZE | POSTER_SIZE, path: string): string {
    const imageBaseUrl = environment.imageBaseUrl;

    return `url(${imageBaseUrl}${backdropSize}${path})`;
}
