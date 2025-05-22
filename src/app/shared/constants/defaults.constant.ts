import { environment } from '../../../environments/environment';
import { SnackbarType } from '../components/snackbar/snackbar.component';
import { BackdropSize } from '../enumerations/backdrop-size.enum';
import { PosterSize } from '../enumerations/poster-size.enum';
import { ProfileSize } from '../enumerations/profile-size.enum';
import { SearchOption } from '../enumerations/search-option.enum';
import { TimeOption } from '../enumerations/time-option.enum';

const placeholdQueryParameters = 'text=Image\\nNot+Available&font=roboto';

export const DEFAULT = {
    page: 1,
    totalPages: 0,
    itemsPerPage: 20,
    selectedTabId: 0,
    genresBatchSize: 3,
    imagesCount: 4,
    videosCount: 4,
    castCount: 8,
    reviewsCount: 4,
    infiniteScrollThreshold: 0.1,
    infiniteScrollRootMargin: 278,
    scrollThreshold: 700,
    carouselAnimationDuration: 500,
    snackbarDuration: 3500,
    snackbarType: 'info' as SnackbarType,
    searchOption: SearchOption.Movie,
    timeOption: TimeOption.Day,
    smallPosterSize: PosterSize.w92,
    mediumPosterSize: PosterSize.w185,
    largePosterSize: PosterSize.w342,
    smallProfileSize: ProfileSize.w45,
    mediumProfileSize: ProfileSize.w185,
    mediumBackdropSize: BackdropSize.w780,
    largeBackdropSize: BackdropSize.original,
    smallPosterFallback: `${environment.placeholdBaseUrl}92x138?${placeholdQueryParameters}`,
    mediumPosterFallback: `${environment.placeholdBaseUrl}185x278?${placeholdQueryParameters}`,
    largePosterFallback: `${environment.placeholdBaseUrl}342x513?${placeholdQueryParameters}`,
    smallProfileFallback: `${environment.placeholdBaseUrl}45x68?${placeholdQueryParameters}`,
    mediumProfileFallback: `${environment.placeholdBaseUrl}185x278?${placeholdQueryParameters}`,
    mediumBackdropFallback: `${environment.placeholdBaseUrl}300x720?${placeholdQueryParameters}`,
    largeBackdropFallback: `${environment.placeholdBaseUrl}1280x720?${placeholdQueryParameters}`,
};
