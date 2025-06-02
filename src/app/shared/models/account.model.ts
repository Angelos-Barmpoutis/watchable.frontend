import { MediaType } from '../enumerations/media-type.enum';

export interface Account {
    id: number;
    username: string;
    name: string;
    include_adult: boolean;
    iso_639_1: string;
    iso_3166_1: string;
    avatar_path: string | null;
}

export interface AddToWatchlistRequest {
    media_type: MediaType;
    media_id: number;
    watchlist: boolean;
}

export interface AddToWatchlistResponse {
    status_code: number;
    status_message: string;
}
