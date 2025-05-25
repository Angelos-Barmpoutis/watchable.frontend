import { Company } from './company.model';
import { Country } from './country,model';
import { ExternalIds } from './external-ids.model';
import { Genre } from './genre.model';
import { Language } from './language.model';
import { Backdrop, Logo, MediaCredits, MediaCreditsCrewPerson, Poster, Video } from './media.model';
import { Network } from './network.model';
import { CreatorPerson, GuestStarPerson, Person, PersonRole } from './people.model';
import { PaginatedReviewItems } from './review.model';

export interface TvShow {
    backdrop_path: string;
    genre_ids: Array<number>;
    id: number;
    original_name: string;
    overview: string;
    poster_path: string;
    first_air_date: string;
    name: string;
    vote_average: number;
    vote_count: number;
    rating?: number;
}

export interface TvShowItem extends TvShow {
    genres: Array<Genre>;
}

export interface TvShowCreditsPerson extends Person {
    roles: Array<PersonRole>;
    total_episode_count: number;
    order: number;
}

export interface PaginatedTvShows {
    page: number;
    results: Array<TvShow>;
    total_pages: number;
    total_results: number;
}

export interface TvShowDetails {
    adult: boolean;
    backdrop_path: string;
    created_by: Array<CreatorPerson>;
    episode_run_time: Array<number>;
    first_air_date: string;
    genres: Array<Genre>;
    homepage: string;
    id: number;
    in_production: boolean;
    languages: Array<string>;
    last_air_date: string;
    last_episode_to_air: TvShowEpisode;
    name: string;
    next_episode_to_air: TvShowEpisode;
    networks: Array<Network>;
    number_of_episodes: number;
    number_of_seasons: number;
    origin_country: Array<string>;
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: Array<Company>;
    production_countries: Array<Country>;
    seasons: Array<TvShowSeason>;
    spoken_languages: Array<Language>;
    status: string;
    tagline: string;
    type: string;
    vote_average: number;
    vote_count: number;
    videos: { results: Array<Video> };
    images: {
        backdrops: Array<Backdrop>;
        posters: Array<Poster>;
        logos: Array<Logo>;
    };
    reviews: PaginatedReviewItems;
    credits: MediaCredits;
    similar: PaginatedTvShows;
    recommendations: PaginatedTvShows;
    external_ids: ExternalIds;
}

export interface TvShowSeason {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
    vote_average: number;
    credits?: MediaCredits;
}

export interface TvShowSeasonDetails {
    _id: string;
    air_date: string;
    episodes: Array<TvShowEpisode>;
    name: string;
    overview: string;
    id: number;
    poster_path: string;
    season_number: number;
    vote_average: number;
    backdrop_path: string;
    credits: MediaCredits;
    images: {
        backdrops: Array<Backdrop>;
        posters: Array<Poster>;
    };
    videos: { results: Array<Video> };
    external_ids: ExternalIds;
}

export interface TvShowExternalIds extends ExternalIds {
    freebase_mid: string | null;
    freebase_id: string | null;
    tvdb_id: number | null;
    tvrage_id: number | null;
}

export interface TvShowEpisode {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    episode_type: string;
    production_code: string;
    runtime: number;
    season_number: number;
    show_id: number;
    still_path: string;
    rating?: number;
}

export interface PaginatedTvShowEpisodes {
    page: number;
    results: Array<TvShowEpisode>;
    total_pages: number;
    total_results: number;
}

export interface TvShowEpisodeDetails {
    air_date: string;
    crew: Array<MediaCreditsCrewPerson>;
    episode_number: number;
    guest_stars: Array<GuestStarPerson>;
    name: string;
    overview: string;
    id: number;
    production_code: string;
    runtime: number;
    season_number: number;
    still_path: string;
    vote_average: number;
    vote_count: number;
    videos?: { results: Array<Video> };
    images?: {
        backdrops: Array<Backdrop>;
        posters: Array<Poster>;
        stills: Array<Backdrop>;
    };
    credits?: MediaCredits;
    external_ids?: ExternalIds;
}

export interface TvShowEpisodeCreditsPerson extends Person {
    character: string;
    credit_id: string;
    order: number;
}

export interface AddTvShowRatingRequest {
    value: number;
}

export interface AddTvShowEpisodeRatingRequest {
    value: number;
}

export interface AddTvShowRatingResponse {
    status_code: number;
    status_message: string;
}

export interface AddTvShowEpisodeRatingResponse {
    status_code: number;
    status_message: string;
}
