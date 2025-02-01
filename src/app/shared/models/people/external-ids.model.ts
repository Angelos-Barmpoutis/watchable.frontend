import { ExternalIds } from '../shared/external-ids.model';

export interface PersonExternalIds extends ExternalIds {
    freebase_mid: string;
    freebase_id: string;
    tvrage_id: number;
    tiktok_id: string;
    youtube_id: string;
}
