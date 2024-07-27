import { Movie } from '../movies/movie.model';
import { Media } from '../shared/media.model';
import { TvSeries } from '../tv-series/tv-series.model';

export interface Person {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
    known_for?: Array<Media | Movie | TvSeries>;
}
