import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Calculate the cutoff date (24 hours ago)
    const cutoffDate = new Date()
    cutoffDate.setHours(cutoffDate.getHours() - 24)
    
    // Find parties older than 24 hours
    const oldParties = await prisma.party.findMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            singers: true
          }
        }
      }
    })
    
    return {
      success: true,
      cutoffDate: cutoffDate.toISOString(),
      oldPartiesCount: oldParties.length,
      oldParties: oldParties.map(party => ({
        id: party.id,
        name: party.name,
        createdAt: party.createdAt.toISOString(),
        singersCount: party._count.singers
      }))
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to check old parties',
      data: error
    })
  }
})
