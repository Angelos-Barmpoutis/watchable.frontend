import { TvSeriesEpisode } from './episode.model';

export interface TvSeriesSeasonDetails {
    _id: string;
    air_date: string;
    episodes: Array<TvSeriesEpisode>;
    name: string;
    overview: string;
    id: number;
    poster_path: string;
    season_number: number;
    vote_average: number;
}
