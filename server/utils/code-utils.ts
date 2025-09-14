import { prisma } from "./prisma";

// Generate a unique join code
export function generateJoinCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  // Generate 6-character code
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}

// Check if join code is unique
export async function isJoinCodeUnique(joinCode: string): Promise<boolean> {
  const existingParty = await prisma.party.findUnique({
    where: { joinCode }
  });
  return !existingParty;
}
