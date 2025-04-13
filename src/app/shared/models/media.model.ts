import { Person } from './people.model';

export interface Media {
    adult: boolean;
    backdrop_path: string;
    id: number;
    name: string;
    original_name: string;
    overview: string;
    poster_path: string;
    media_type: string;
    genre_ids: Array<number>;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
    origin_country: Array<string>;
}

export interface Video {
    id: string;
    name: string;
    key: string;
    site: string;
    size: number;
    type: string;
}

export interface Backdrop {
    aspect_ratio: number;
    file_path: string;
    height: number;
    iso_639_1: string | null;
    vote_average: number;
    vote_count: number;
    width: number;
}

export interface Poster {
    aspect_ratio: number;
    file_path: string;
    height: number;
    iso_639_1: string | null;
    vote_average: number;
    vote_count: number;
    width: number;
}

export interface MediaCredits {
    cast: Array<MediaCreditsCastPerson>;
    crew: Array<MediaCreditsCrewPerson>;
}

export interface MediaCreditsCrewPerson extends Person {
    credit_id: string;
    department: string;
    job: string;
}

export interface MediaCreditsCastPerson extends Person {
    character: string;
    credit_id: string;
    order: number;
}
