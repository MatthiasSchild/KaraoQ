import { PartyEntity } from "./party-entities";
import { prisma } from "../utils/prisma";
import { generateJoinCode, isJoinCodeUnique } from "../utils/code-utils";

export interface PartyRepository {
  create(name: string): Promise<PartyEntity>;
  list(): Promise<PartyEntity[]>;
  findById(id: string): Promise<PartyEntity | null>;
  findByJoinCode(joinCode: string): Promise<PartyEntity | null>;
  delete(id: string): Promise<void>;
  update(id: string, name: string): Promise<PartyEntity>;
}

export class PartyRepositoryImpl implements PartyRepository {
  async create(name: string): Promise<PartyEntity> {
    let joinCode: string;
    
    // Generate unique join code
    do {
      joinCode = generateJoinCode();
    } while (!(await isJoinCodeUnique(joinCode)));

    const newParty = await prisma.party.create({
      data: {
        name: name,
        joinCode: joinCode,
      }
    });
    
    return {
      id: newParty.id,
      name: newParty.name,
      joinCode: newParty.joinCode,
      createdAt: newParty.createdAt.toISOString(),
    };
  }

  async list(): Promise<PartyEntity[]> {
    const parties = await prisma.party.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return parties.map((party: any) => ({
      id: party.id,
      name: party.name,
      joinCode: party.joinCode,
      createdAt: party.createdAt.toISOString(),
    }));
  }

  async findById(id: string): Promise<PartyEntity | null> {
    const party = await prisma.party.findUnique({
      where: { id }
    });
    
    if (!party) {
      return null;
    }
    
    return {
      id: party.id,
      name: party.name,
      joinCode: party.joinCode,
      createdAt: party.createdAt.toISOString(),
    };
  }

  async findByJoinCode(joinCode: string): Promise<PartyEntity | null> {
    const party = await prisma.party.findUnique({
      where: { joinCode }
    });
    
    if (!party) {
      return null;
    }
    
    return {
      id: party.id,
      name: party.name,
      joinCode: party.joinCode,
      createdAt: party.createdAt.toISOString(),
    };
  }

  async delete(id: string): Promise<void> {
    await prisma.party.delete({
      where: { id }
    });
  }

  async update(id: string, name: string): Promise<PartyEntity> {
    const party = await prisma.party.update({
      where: { id },
      data: { name }
    });
    
    return {
      id: party.id,
      name: party.name,
      joinCode: party.joinCode,
      createdAt: party.createdAt.toISOString(),
    };
  }
}

export const partyRepository: PartyRepository = new PartyRepositoryImpl();
