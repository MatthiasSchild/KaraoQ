import { defineCronHandler } from '#nuxt/cron'
import { prisma } from '../utils/prisma'

export default defineCronHandler('everyFifteenMinutes', async () => {
  try {
    console.log('🧹 Starting cleanup of old parties...')
    
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
        createdAt: true
      }
    })
    
    if (oldParties.length === 0) {
      console.log('✅ No old parties found to clean up')
      return
    }
    
    console.log(`🗑️ Found ${oldParties.length} old parties to delete:`)
    oldParties.forEach(party => {
      console.log(`  - ${party.name} (ID: ${party.id}, Created: ${party.createdAt.toISOString()})`)
    })
    
    // Delete parties (singers will be automatically deleted due to CASCADE)
    const deleteResult = await prisma.party.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      }
    })
    
    console.log(`✅ Successfully deleted ${deleteResult.count} old parties and their associated singers`)
    
  } catch (error) {
    console.error('❌ Error during cleanup of old parties:', error)
  }
})
