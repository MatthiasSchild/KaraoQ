import { singerRepository } from "~~/server/persistence/singer-repositories"
import { getAuthFromEvent } from "~~/server/utils/jwt"

export default defineEventHandler(async (event): Promise<SingersResponseDto> => {
  const auth = getAuthFromEvent(event);
  if (!auth) {
    throw createError({
      statusCode: 401,
      statusMessage: "Not authenticated",
    })
  }

  const entities = await singerRepository.list(auth.partyId)
  const models: SingerDto[] = entities
    .filter((entity) => !entity.done)
    .map((entity) => ({
      id: entity.id,
      session: entity.session,
      singer: entity.singer,
      song: entity.song,
      artist: entity.artist,
      addedAt: entity.addedAt,
      skipped: !!entity.skipped,
    }))

  return {
    singers: models,
    count: models.length,
  }
})