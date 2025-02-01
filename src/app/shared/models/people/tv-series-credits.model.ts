import { TvSeriesCreditsCastPerson } from './tv-series-credits-cast-person.model';
import { TvSeriesCreditsCrewPerson } from './tv-series-credits-crew-person.model';

export interface TvSeriesCredits {
    cast: Array<TvSeriesCreditsCastPerson>;
    crew: Array<TvSeriesCreditsCrewPerson>;
}
