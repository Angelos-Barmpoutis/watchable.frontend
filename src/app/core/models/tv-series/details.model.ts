import { CreatorPerson } from '../people/creator-person.model';
import { Company } from '../shared/company.model';
import { Country } from '../shared/country,model';
import { Genre } from '../shared/genre.model';
import { Language } from '../shared/language.model';
import { Network } from '../shared/network.model';
import { TvSeriesEpisode } from './episode.model';
import { TvSeriesSeason } from './season.model';

export interface TvSeriesDetails {
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
    last_episode_to_air: TvSeriesEpisode;
    name: string;
    next_episode_to_air: TvSeriesEpisode;
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
    seasons: Array<TvSeriesSeason>;
    spoken_languages: Array<Language>;
    status: string;
    tagline: string;
    type: string;
    vote_avergae: number;
    vote_count: number;
}
