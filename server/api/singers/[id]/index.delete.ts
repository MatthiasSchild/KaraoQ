import { singerRepository } from "~~/server/persistence/singer-repositories";
import { getAuthFromEvent } from "~~/server/utils/jwt";

export default defineEventHandler(async (event) => {
  const auth = getAuthFromEvent(event);
  if (!auth) {
    throw createError({
      statusCode: 401,
      statusMessage: "Not authenticated",
    });
  }

  const singerId = getRouterParam(event, 'id');
  if (!singerId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Singer ID is required",
    });
  }

  try {
    // Get the singer to check if it belongs to the current user
    const singer = await singerRepository.findById(singerId);
    
    if (!singer) {
      throw createError({
        statusCode: 404,
        statusMessage: "Singer not found",
      });
    }

    // Check if the singer belongs to the current user's session
    if (singer.session !== auth.sessionId) {
      throw createError({
        statusCode: 403,
        statusMessage: "You can only delete your own entries",
      });
    }

    // Delete the singer
    await singerRepository.delete(singerId);

    return {
      success: true,
      message: "Singer deleted successfully"
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete singer",
    });
  }
});