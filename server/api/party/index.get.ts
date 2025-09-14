import { getAuthFromEvent } from '~~/server/utils/jwt';
import { partyRepository } from '~~/server/persistence/party-repositories';

export default defineEventHandler(async (event) => {
  const auth = getAuthFromEvent(event);
  
  if (!auth) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated',
    });
  }

  try {
    // Get party details from repository
    const party = await partyRepository.findById(auth.partyId);
    
    if (!party) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Party not found',
      });
    }

    return {
      id: party.id,
      name: party.name,
      joinCode: party.joinCode,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch party details',
    });
  }
});
