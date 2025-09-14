export interface SingerDto {
  id: string;
  session: string;
  singer: string;
  song: string;
  artist: string;
  skipped: boolean;
  addedAt: string;
  done?: string; // ISO timestamp when singer finished
}

export interface SingersResponseDto {
    singers: SingerDto[];
  count: number;
}

export interface CreateSingerResponseDto {
  singersBefore: number;
}
