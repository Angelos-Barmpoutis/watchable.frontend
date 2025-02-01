import { KnownForItem } from '../shared/known-for-item.model';

export interface Person {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
    known_for?: Array<KnownForItem>;
}
