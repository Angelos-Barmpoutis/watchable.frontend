import { Company } from '../shared/company.model';
import { Country } from '../shared/country,model';
import { Genre } from '../shared/genre.model';
import { Language } from '../shared/language.model';
import { PaginatedReviewItems } from '../shared/paginated-review-items.model';

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
