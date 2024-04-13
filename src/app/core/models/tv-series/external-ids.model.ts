import { ExternalIds } from '../shared/external-ids.model';

export interface TvSeriesExternalIds extends ExternalIds {
    freebase_mid: string;
    freebase_id: string;
    tvdb_id: number;
    tvrage_id: number;
}
