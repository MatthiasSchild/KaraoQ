import z from "zod";
import { partyRepository } from "~~/server/persistence/party-repositories";
import { createSimpleToken } from "~~/server/utils/jwt";

const schema = z.object({
  joinCode: z.string().length(6, "Join code must be exactly 6 characters"),
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

  // Find the party by join code
  const party = await partyRepository.findByJoinCode(parsed.data.joinCode);
  
  if (!party) {
    throw createError({
      statusCode: 404,
      statusMessage: "Party not found",
    });
  }

  // Generate a random session ID
  const sessionId = crypto.randomUUID();
  
  // Create token with party info but NOT admin privileges
  const token = createSimpleToken({
    partyId: party.id,
    partyName: party.name,
    joinCode: party.joinCode,
    sessionId: sessionId,
    isAdmin: false, // Regular user, not admin
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
