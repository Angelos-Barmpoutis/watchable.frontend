import { environment } from '../../../environments/environment';
import { BACKDROP_SIZE } from '../enumerations/backdrop-size.enum';
import { POSTER_SIZE } from '../enumerations/poster-size.enum';
import { PROFILE_SIZE } from '../enumerations/profile-size.enum';
import { SEARCH_OPTION } from '../enumerations/search-option.enum';
import { TIME_OPTION } from '../enumerations/time-option.enum';

const placeholdQueryParameters = 'text=Image\\nNot+Available&font=roboto';

export const DEFAULT = {
    page: 1,
    totalPages: 0,
    itemsPerPage: 20,
    selectedTabId: 0,
    genresBatchSize: 3,
    imagesCount: 3,
    videosCount: 3,
    castCount: 6,
    reviewsCount: 3,
    infiniteScrollThreshold: 0.1,
    infiniteScrollRootMargin: 278,
    scrollThreshold: 700,
    searchOption: SEARCH_OPTION.Movie,
    timeOption: TIME_OPTION.Day,
    smallPosterSize: POSTER_SIZE.w92,
    mediumPosterSize: POSTER_SIZE.w185,
    largePosterSize: POSTER_SIZE.w342,
    smallProfileSize: PROFILE_SIZE.w45,
    mediumProfileSize: PROFILE_SIZE.w185,
    mediumBackdropSize: BACKDROP_SIZE.w780,
    largeBackdropSize: BACKDROP_SIZE.original,
    smallPosterFallback: `${environment.placeholdBaseUrl}92x138?${placeholdQueryParameters}`,
    mediumPosterFallback: `${environment.placeholdBaseUrl}185x278?${placeholdQueryParameters}`,
    largePosterFallback: `${environment.placeholdBaseUrl}342x513?${placeholdQueryParameters}`,
    smallProfileFallback: `${environment.placeholdBaseUrl}45x68?${placeholdQueryParameters}`,
    mediumProfileFallback: `${environment.placeholdBaseUrl}185x278?${placeholdQueryParameters}`,
    mediumBackdropFallback: `${environment.placeholdBaseUrl}300x720?${placeholdQueryParameters}`,
    largeBackdropFallback: `${environment.placeholdBaseUrl}1280x720?${placeholdQueryParameters}`,
};
