import { getAuthFromEvent } from '~~/server/utils/jwt';
import { partyRepository } from '~~/server/persistence/party-repositories';

export default defineEventHandler(async (event) => {
  const auth = getAuthFromEvent(event);
  
  if (!auth) {
    return {
      authenticated: false,
      isAdmin: false
    };
  }
  
  // Check if the party still exists
  const party = await partyRepository.findById(auth.partyId);
  if (!party) {
    // Party no longer exists, log the user out
    setCookie(event, 'auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/'
    });
    
    return {
      authenticated: false,
      isAdmin: false
    };
  }
  
  return {
    authenticated: true,
    isAdmin: auth.isAdmin,
    partyId: auth.partyId,
    partyName: auth.partyName,
    joinCode: auth.joinCode,
    sessionId: auth.sessionId
  };
});
