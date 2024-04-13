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
