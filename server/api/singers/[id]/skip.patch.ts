import { singerRepository } from "~~/server/persistence/singer-repositories";

export default defineEventHandler(async (event) => {
  const id = await getRouterParam(event, 'id')
  if (!id) {
    throw createError({
        statusCode: 401,
        statusMessage: "Missing id",
      })
  }

  await singerRepository.skip(id);
  return null;
})