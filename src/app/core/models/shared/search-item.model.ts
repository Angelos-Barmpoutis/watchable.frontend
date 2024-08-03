import { Genre } from './genre.model';
import { KnownForItem } from './known-for-item.model';
import { MediaType } from './media-type.model';

export interface SearchItem {
    backdrop_path?: string;
    id: number;
    title?: string;
    original_title?: string;
    name?: string;
    original_name?: string;
    overview: string;
    poster_path?: string;
    profile_path?: string;
    media_type: MediaType;
    adult: boolean;
    original_language: string;
    genre_ids: Array<Genre>;
    popularity: number;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
    vote_count: number;
    origin_country?: Array<string>;
    known_for?: Array<KnownForItem>;
    known_for_department?: string;
}
