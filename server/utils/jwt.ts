// Simple JWT-like token utilities (replace with proper JWT library in production)
export interface JWTPayload {
  partyId: string;
  partyName: string;
  joinCode: string;
  sessionId: string;
  isAdmin: boolean;
  exp?: number;
}

export function createSimpleToken(payload: Omit<JWTPayload, 'exp'>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const data = btoa(JSON.stringify({
    ...payload,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
  }));
  const signature = btoa('signature-placeholder'); // In production, use proper HMAC
  return `${header}.${data}.${signature}`;
}

export function verifySimpleToken(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }
    
    return payload as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function getAuthFromEvent(event: any): JWTPayload | null {
  const token = getCookie(event, 'auth-token');
  if (!token) {
    return null;
  }
  return verifySimpleToken(token);
}
