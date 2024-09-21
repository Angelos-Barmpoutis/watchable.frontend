import { BACKDROP_SIZE } from '../../core/enumerations/backdrop-size.enum';
import { POSTER_SIZE } from '../../core/enumerations/poster-size.enum';
import { PROFILE_SIZE } from '../../core/enumerations/profile-size.enum';
import { SEARCH_FILTER } from '../../core/enumerations/search-filter.enum';
import { TRENDING_FILTER } from '../../core/enumerations/trending-filter.enum';

export const DEFAULT = {
    page: 1,
    totalPages: 10,
    searchFilter: SEARCH_FILTER.Multi,
    searchItemsCount: 5,
    trendingFilter: TRENDING_FILTER.Day,
    smallPosterSize: POSTER_SIZE.w92,
    smallPosterFallback: 'https://placehold.co/92x138?text=Image\\nNot+Available&font=roboto',
    mediumPosterSize: POSTER_SIZE.w185,
    mediumPosterFallback: 'https://placehold.co/185x278?text=Image\\nNot+Available&font=roboto',
    largePosterSize: POSTER_SIZE.w342,
    largePosterFallback: 'https://placehold.co/342x513?text=Image\\nNot+Available&font=roboto',
    smallProfileSize: PROFILE_SIZE.w45,
    smallProfileFallback: 'https://placehold.co/45x68?text=Image\\nNot+Available&font=roboto',
    mediumProfileSize: PROFILE_SIZE.w185,
    mediumProfileFallback: 'https://placehold.co/185x278?text=Image\\nNot+Available&font=roboto',
    mediumBackdropSize: BACKDROP_SIZE.w780,
    mediumBackdropFallback: 'https://placehold.co/300x720?text=Image\\nNot+Available&font=roboto',
    largeBackdropSize: BACKDROP_SIZE.original,
    largeBackdropFallback: 'https://placehold.co/1280x720?text=Image\\nNot+Available&font=roboto',
};