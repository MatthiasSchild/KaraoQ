import { singerRepository } from "~~/server/persistence/singer-repositories"
import { getAuthFromEvent } from "~~/server/utils/jwt"

export default defineEventHandler(async (event) => {
  const id = await getRouterParam(event, 'id')
  if (!id) {
    throw createError({
        statusCode: 401,
        statusMessage: "Missing id",
      })
  }

  const auth = getAuthFromEvent(event);
  if (!auth) {
    throw createError({
      statusCode: 401,
      statusMessage: "Not authenticated",
    })
  }

  await singerRepository.resetSkippedSingers(auth.partyId)
  await singerRepository.finish(id)
  return null;
})
