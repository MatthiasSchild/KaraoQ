export default defineEventHandler(async (event) => {
  // Delete the auth-token cookie by setting it to expire immediately
  setCookie(event, 'auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0, // Expire immediately
    path: '/'
  });

  return {
    success: true,
    message: 'Logged out successfully'
  };
});
