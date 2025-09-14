import { SingerEntity } from "./singer-entities";
import { prisma } from "../utils/prisma";

export interface SingerRepository {
  create(partyId: string, session: string, singer: string, song: string, artist: string): Promise<SingerEntity>;
  list(partyId: string): Promise<SingerEntity[]>;
  findById(id: string): Promise<SingerEntity | null>;
  singerCountBefore(partyId: string, singer: SingerEntity): Promise<number>;
  skip(id: string): Promise<void>;
  resetSkippedSingers(partyId: string): Promise<void>;
  delete(id: string): Promise<void>;
  finish(id: string): Promise<void>;
  undo(id: string): Promise<void>;
}

export class SingerRepositoryImpl implements SingerRepository {
  async create(partyId: string, session: string, singer: string, song: string, artist: string): Promise<SingerEntity> {
    const newSinger = await prisma.singer.create({
      data: {
        partyId: partyId,
        session: session,
        singer: singer,
        song: song,
        artist: artist,
      }
    });
    
    return {
      id: newSinger.id,
      partyId: newSinger.partyId,
      session: newSinger.session,
      singer: newSinger.singer,
      song: newSinger.song,
      artist: newSinger.artist,
      addedAt: newSinger.addedAt.toISOString(),
      skipped: newSinger.skipped?.toISOString() || null,
      done: newSinger.done?.toISOString() || null,
    };
  }

  async list(partyId: string): Promise<SingerEntity[]> {
    const singers = await prisma.singer.findMany({
      where: { partyId },
      orderBy: { addedAt: 'asc' }
    });
    
    return singers.map(singer => ({
      id: singer.id,
      partyId: singer.partyId,
      session: singer.session,
      singer: singer.singer,
      song: singer.song,
      artist: singer.artist,
      addedAt: singer.addedAt.toISOString(),
      skipped: singer.skipped?.toISOString() || null,
      done: singer.done?.toISOString() || null,
    }));
  }

  async findById(id: string): Promise<SingerEntity | null> {
    const singer = await prisma.singer.findUnique({
      where: { id }
    });
    
    if (!singer) {
      return null;
    }
    
    return {
      id: singer.id,
      partyId: singer.partyId,
      session: singer.session,
      singer: singer.singer,
      song: singer.song,
      artist: singer.artist,
      addedAt: singer.addedAt.toISOString(),
      skipped: singer.skipped?.toISOString() || null,
      done: singer.done?.toISOString() || null,
    };
  }

  async singerCountBefore(partyId: string, singer: SingerEntity): Promise<number> {
    const singers = await prisma.singer.findMany({
      where: { 
        partyId,
        done: null
      },
      orderBy: { addedAt: 'asc' }
    });
    
    let counter = 0;
    for (const s of singers) {
      if (s.id === singer.id) {
        break;
      }
      counter++;
    }
    
    return counter;
  }

  async skip(id: string): Promise<void> {
    await prisma.singer.update({
      where: { id },
      data: { skipped: new Date() }
    });
  }

  async resetSkippedSingers(partyId: string): Promise<void> {
    await prisma.singer.updateMany({
      where: { partyId },
      data: { skipped: null }
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.singer.delete({
      where: { id }
    });
  }

  async finish(id: string): Promise<void> {
    await prisma.singer.update({
      where: { id },
      data: { done: new Date() }
    });
  }

  async undo(id: string): Promise<void> {
    const singer = await prisma.singer.findUnique({
      where: { id }
    });
    
    if (!singer) {
      throw new Error("singer not found");
    }

    if (singer.done) {
      await prisma.singer.update({
        where: { id },
        data: { done: null }
      });
    } else if (singer.skipped) {
      await prisma.singer.update({
        where: { id },
        data: { skipped: null }
      });
    }
  }
}

export const singerRepository: SingerRepository = new SingerRepositoryImpl();
