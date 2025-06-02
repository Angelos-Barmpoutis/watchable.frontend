import { ExternalIds } from './external-ids.model';
import { KnownForItem } from './known-for-item.model';
import { Backdrop, Logo, MediaCredits, Poster } from './media.model';

export interface Person {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
    known_for?: Array<KnownForItem>;
}

export interface PaginatedPeople {
    dates?: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: Array<Person>;
    total_pages: number;
    total_results: number;
}

export interface PersonRole {
    credit_id: string;
    character: string;
    episode_count: number;
}

export interface GuestStarPerson {
    character: string;
    credit_id: string;
    order: number;
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
}

export interface PersonExternalIds extends ExternalIds {
    freebase_mid: string;
    freebase_id: string;
    tvrage_id: number;
    tiktok_id: string;
    youtube_id: string;
}

export interface PersonDetails {
    adult: boolean;
    also_known_as: Array<string>;
    biography: string;
    birthday: string;
    deathday: string;
    gender: number;
    homepage: string;
    id: number;
    imdb_id: string;
    known_for_department: string;
    name: string;
    place_of_birth: string;
    popularity: number;
    profile_path: string;
    images?: {
        profiles: Array<Poster | Backdrop | Logo>;
    };
    external_ids?: ExternalIds;
    movie_credits?: MediaCredits;
    tv_credits?: MediaCredits;
}

export interface CrewPerson {
    job: string;
    department: string;
    credit_id: string;
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
}

export interface CreatorPerson {
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string;
}
