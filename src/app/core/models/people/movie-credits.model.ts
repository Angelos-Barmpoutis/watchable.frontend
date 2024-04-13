import { MovieCreditsCastPerson } from './movie-credits-cast-person.model';
import { MovieCreditsCrewPerson } from './movie-credits-crew-person.model';

export interface MovieCredits {
    cast: Array<MovieCreditsCastPerson>;
    crew: Array<MovieCreditsCrewPerson>;
}
