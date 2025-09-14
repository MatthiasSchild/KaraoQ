export interface SingerEntity {
    id: string;
    partyId: string;
    session: string;
    singer: string;
    song: string;
    artist: string;
    addedAt: string;
    skipped: string | null;
    done: string | null;
}
