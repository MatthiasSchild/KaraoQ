import z from "zod";
import { partyRepository } from "~~/server/persistence/party-repositories";
import { createSimpleToken } from "~~/server/utils/jwt";

const schema = z.object({
  name: z.string().min(1, "Party name is required"),
});

export default defineEventHandler(async (event) => {
  const parsed = await readValidatedBody(event, body => schema.safeParse(body));
  
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request",
      data: parsed.error,
    });
  }

  // Create the party
  const party = await partyRepository.create(parsed.data.name);
  
  // Generate a random session ID
  const sessionId = crypto.randomUUID();
  
  // Create token with party info and admin privileges
  const token = createSimpleToken({
    partyId: party.id,
    partyName: party.name,
    joinCode: party.joinCode,
    sessionId: sessionId,
    isAdmin: true,
  });

  // Set HTTP-only cookie
  setCookie(event, 'auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return {
    party: {
      id: party.id,
      name: party.name,
      joinCode: party.joinCode,
    },
    sessionId,
  };
});
