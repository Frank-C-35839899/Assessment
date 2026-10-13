const { onCall } = require('firebase-functions/v2/https')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

initializeApp()

const db = getFirestore()

exports.getDashboardStats = onCall(async () => {
  try {
    const [usersSnapshot, volunteersSnapshot, ratingsSnapshot] = await Promise.all([
      db.collection('users').get(),
      db.collection('volunteers').get(),
      db.collection('ratings').get(),
    ])

    const totalUsers = usersSnapshot.size
    const totalVolunteers = volunteersSnapshot.size
    const totalRatings = ratingsSnapshot.size

    let ratingTotal = 0

    ratingsSnapshot.forEach((doc) => {
      const data = doc.data()

      const score = Number(data.score)

      if (!Number.isNaN(score)) {
        ratingTotal += score
      }
    })

    const averageRating = totalRatings > 0 ? Number((ratingTotal / totalRatings).toFixed(1)) : 0

    return {
      success: true,
      totalUsers,
      totalVolunteers,
      totalRatings,
      averageRating,
    }
  } catch (error) {
    console.error('Error getting dashboard stats:', error)

    throw new Error('Unable to load dashboard statistics.')
  }
})
