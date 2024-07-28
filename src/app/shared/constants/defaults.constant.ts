import { POSTER_SIZE } from '../../core/enumerations/poster-size.enum';
import { PROFILE_SIZE } from '../../core/enumerations/profile-size.enum';
import { TRENDING_FILTER } from '../../core/enumerations/trending-filter.enum';

export const DEFAULT = {
    page: 1,
    totalPages: 10,
    trendingFilter: TRENDING_FILTER.Day,
    smallPosterSize: POSTER_SIZE.w92,
    smallPosterFallback: 'https://placehold.co/92x138?text=Image\\nNot+Available&font=roboto',
    mediumPosterSize: POSTER_SIZE.w185,
    mediumPosterFallback: 'https://placehold.co/185x278?text=Image\\nNot+Available&font=roboto',
    mediumProfileSize: PROFILE_SIZE.w185,
    mediumProfileFallback: 'https://placehold.co/185x278?text=Image\\nNot+Available&font=roboto',
};
