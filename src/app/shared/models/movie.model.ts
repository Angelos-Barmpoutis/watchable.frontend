import { Company } from './company.model';
import { Country } from './country,model';
import { ExternalIds } from './external-ids.model';
import { Genre } from './genre.model';
import { Language } from './language.model';
import { Person } from './people.model';
import { PaginatedReviewItems } from './review.model';

export interface Movie {
    adult: boolean;
    backdrop_path: string;
    genre_ids: Array<number>;
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export interface MovieItem extends Movie {
    genres: Array<Genre>;
}

export interface PaginatedMovies {
    dates?: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: Array<Movie>;
    total_pages: number;
    total_results: number;
}

export interface MovieCreditsPerson extends Person {
    cast_id: number;
    character: string;
    credit_id: string;
    order: number;
}

export type MovieExternalIds = ExternalIds;

export interface MovieDetails {
    adult: boolean;
    backdrop_path: string;
    belongs_to_collection: number;
    budget: number;
    genres: Array<Genre>;
    homepage: string;
    id: number;
    imdb_id: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    origin_country: Array<string>;
    production_companies: Array<Company>;
    production_countries: Array<Country>;
    release_date: string;
    revenue: number;
    runtime: number;
    spoken_languages: Array<Language>;
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    videos: { results: Array<Video> };
    images: {
        backdrops: Array<Backdrop>;
        posters: Array<Poster>;
    };
    reviews: PaginatedReviewItems;
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
    width: number;
}

export interface Poster {
    aspect_ratio: number;
    file_path: string;
    height: number;
    width: number;
}

export interface MovieCredits {
    cast: Array<MovieCreditsCastPerson>;
    crew: Array<MovieCreditsCrewPerson>;
}

export interface MovieCreditsCrewPerson {
    adult: boolean;
    backdrop_path: string;
    genre_ids: Array<number>;
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    credit_id: string;
    department: string;
    job: string;
}

export interface MovieCreditsCastPerson {
    adult: boolean;
    backdrop_path: string;
    genre_ids: Array<number>;
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    character: string;
    credit_id: string;
    order: number;
}
