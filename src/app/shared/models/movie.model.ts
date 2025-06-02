import { Company } from './company.model';
import { Country } from './country,model';
import { ExternalIds } from './external-ids.model';
import { Genre } from './genre.model';
import { Language } from './language.model';
import { Backdrop, Logo, MediaCredits, Poster, Video } from './media.model';
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
    rating?: number;
}

export interface MovieItem extends Movie {
    genres: Array<Genre>;
}

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
        logos: Array<Logo>;
    };
    reviews: PaginatedReviewItems;
    credits: MediaCredits;
    similar: PaginatedMovies;
    recommendations: PaginatedMovies;
    external_ids: MovieExternalIds;
}

export interface PaginatedMovies {
    page: number;
    results: Array<Movie>;
    total_pages: number;
    total_results: number;
}

export type MovieExternalIds = ExternalIds;

export interface AddMovieRatingRequest {
    value: number;
}

export interface AddMovieRatingResponse {
    status_code: number;
    status_message: string;
}
