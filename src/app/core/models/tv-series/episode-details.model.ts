import { CrewPerson } from '../people/crew-person.model';
import { GuestStarPerson } from '../people/guest-star-person.model';

export interface TvSeriesEpisodeDetails {
    air_date: string;
    crew: Array<CrewPerson>;
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
}
