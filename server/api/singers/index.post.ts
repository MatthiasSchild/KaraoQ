import z from "zod";
import { singerRepository } from "~~/server/persistence/singer-repositories";
import { getAuthFromEvent } from "~~/server/utils/jwt";

const schema = z.object({
  singer: z.string(),
  song: z.string(),
  artist: z.string(),
})

export default defineEventHandler(async (event): Promise<CreateSingerResponseDto> => {
  const auth = getAuthFromEvent(event);
  if (!auth) {
    throw createError({
      statusCode: 401,
      statusMessage: "Not authenticated",
    })
  }

  const parsed = await readValidatedBody(event, body => schema.safeParse(body))
  if (!parsed.success) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid request",
      data: parsed.error,
    })
  }

  const newSinger = await singerRepository.create(
    auth.partyId,
    auth.sessionId,
    parsed.data.singer,
    parsed.data.song,
    parsed.data.artist,
  )
  const singersBefore = await singerRepository.singerCountBefore(auth.partyId, newSinger)

  return { singersBefore }
})