import { Movie } from '../models/movie.model';
import { Person } from '../models/people.model';
import { TvShow } from '../models/tv-show.model';

export function filterMediaItems(mediaItem: Array<Movie | TvShow>): Array<Movie | TvShow> {
    return mediaItem.filter((item) => item.poster_path);
}

export function filterPersonItems(mediaItem: Array<Person>): Array<Person> {
    return mediaItem.filter((item) => item.profile_path);
}
