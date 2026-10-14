const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { defineSecret } = require('firebase-functions/params')

const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

const { Resend } = require('resend')

const { GoogleGenAI } = require('@google/genai')
/* =========================
   Firebase Admin
========================= */

initializeApp()

const db = getFirestore()

/* =========================
   Firebase Secret
========================= */

const resendApiKey = defineSecret('RESEND_API_KEY')
const geminiApiKey = defineSecret('GEMINI_API_KEY')
/* =========================
   Dashboard Statistics
========================= */

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

    ratingsSnapshot.forEach((document) => {
      const data = document.data()

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

    throw new HttpsError('internal', 'Unable to load dashboard statistics.')
  }
})

/* =========================
   Send Admin Email
========================= */

exports.sendAdminEmail = onCall(
  {
    secrets: [resendApiKey],
  },

  async (request) => {
    /* =========================
         1. Authentication Check
      ========================= */

    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'You must be logged in to send email.')
    }

    const uid = request.auth.uid

    /* =========================
         2. Admin Role Check
      ========================= */

    const userSnapshot = await db.collection('users').doc(uid).get()

    if (!userSnapshot.exists) {
      throw new HttpsError('permission-denied', 'User profile could not be found.')
    }

    const userData = userSnapshot.data()

    if (userData.role !== 'admin') {
      throw new HttpsError('permission-denied', 'Only administrators can send email.')
    }

    /* =========================
         3. Request Data
      ========================= */

    const { to, subject, message, attachment } = request.data || {}

    /* =========================
         4. Validate Email
      ========================= */

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!to || typeof to !== 'string' || !emailPattern.test(to.trim())) {
      throw new HttpsError('invalid-argument', 'Please provide a valid recipient email address.')
    }

    /* =========================
         5. Validate Subject
      ========================= */

    if (
      !subject ||
      typeof subject !== 'string' ||
      subject.trim().length < 1 ||
      subject.trim().length > 150
    ) {
      throw new HttpsError('invalid-argument', 'Subject must be between 1 and 150 characters.')
    }

    /* =========================
         6. Validate Message
      ========================= */

    if (
      !message ||
      typeof message !== 'string' ||
      message.trim().length < 1 ||
      message.trim().length > 5000
    ) {
      throw new HttpsError('invalid-argument', 'Message must be between 1 and 5000 characters.')
    }

    /* =========================
         7. Prepare Resend
      ========================= */

    const resend = new Resend(resendApiKey.value())

    const emailData = {
      /*
          For development/testing,
          Resend provides this sender.

          Later, if you verify your own
          domain, replace this address.
        */

      from: 'Urban Canopy <onboarding@resend.dev>',

      to: [to.trim().toLowerCase()],

      subject: subject.trim().slice(0, 150),

      text: message.trim().slice(0, 5000),
    }

    /* =========================
         8. Optional Attachment
      ========================= */

    if (attachment) {
      const { filename, content, contentType } = attachment

      if (!filename || typeof filename !== 'string') {
        throw new HttpsError('invalid-argument', 'Attachment filename is invalid.')
      }

      if (!content || typeof content !== 'string') {
        throw new HttpsError('invalid-argument', 'Attachment content is invalid.')
      }

      /*
          Convert Base64 string
          from Vue to Buffer.
        */

      const fileBuffer = Buffer.from(content, 'base64')

      /*
          Limit attachment to 5 MB.

          This keeps the callable
          request reasonably small.
        */

      const maxFileSize = 5 * 1024 * 1024

      if (fileBuffer.length > maxFileSize) {
        throw new HttpsError('invalid-argument', 'Attachment must not exceed 5 MB.')
      }

      emailData.attachments = [
        {
          filename: filename.trim().slice(0, 150),

          content: fileBuffer,

          /*
              contentType is optional.
              If provided by the frontend,
              pass it through.
            */

          ...(contentType
            ? {
                contentType,
              }
            : {}),
        },
      ]
    }

    /* =========================
         9. Send Email
      ========================= */

    try {
      const { data, error } = await resend.emails.send(emailData)

      if (error) {
        console.error('Resend API error:', error)

        throw new HttpsError('internal', error.message || 'Email could not be sent.')
      }

      console.log('Email sent successfully:', data)

      return {
        success: true,

        message: 'Email sent successfully.',

        emailId: data?.id || null,
      }
    } catch (error) {
      console.error('Email send failed:', error)

      if (error instanceof HttpsError) {
        throw error
      }

      throw new HttpsError('internal', 'Unable to send email.')
    }
  },
)
/* =========================
   Generate Plant Recommendation
========================= */

exports.generatePlantRecommendation = onCall(
  {
    secrets: [geminiApiKey],
  },

  async (request) => {
    try {
      /* =========================
         1. Read Input
      ========================= */

      const { sunlight, space, drainage } = request.data || {}

      /* =========================
         2. Validate Input
      ========================= */

      const allowedSunlight = ['full', 'partial', 'shade']

      const allowedSpace = ['small', 'medium', 'large']

      const allowedDrainage = ['well', 'moderate', 'poor']

      if (
        !allowedSunlight.includes(sunlight) ||
        !allowedSpace.includes(space) ||
        !allowedDrainage.includes(drainage)
      ) {
        throw new HttpsError(
          'invalid-argument',
          'Please provide valid sunlight, space and drainage values.',
        )
      }

      /* =========================
         3. Convert Values
      ========================= */

      const sunlightDescriptions = {
        full: 'Full Sun, receiving at least 6 hours of direct sunlight per day',

        partial: 'Partial Sun, receiving approximately 3 to 6 hours of direct sunlight per day',

        shade: 'Shade, receiving less than 3 hours of direct sunlight per day',
      }

      const spaceDescriptions = {
        small:
          'Small planting area, up to 10 square metres, such as a courtyard or narrow garden bed',

        medium:
          'Medium planting area, approximately 10 to 30 square metres, such as a typical front yard',

        large:
          'Large planting area, over 30 square metres, such as a backyard, park or community green space',
      }

      const drainageDescriptions = {
        well: 'Well-drained soil where water generally drains away within a few hours',

        moderate:
          'Moderately drained soil that remains moist temporarily but does not stay waterlogged',

        poor: 'Poorly drained soil where water may remain for many hours or puddles commonly form',
      }

      /* =========================
         4. Create Gemini Client
      ========================= */

      const ai = new GoogleGenAI({
        apiKey: geminiApiKey.value(),
      })

      /* =========================
         5. Build Prompt
      ========================= */

      const prompt = `
You are an urban horticulture assistant helping users in Melbourne, Victoria, Australia.

Recommend THREE plants or trees that could potentially suit the user's planting conditions.

Planting conditions:

Sunlight:
${sunlightDescriptions[sunlight]}

Available space:
${spaceDescriptions[space]}

Soil drainage:
${drainageDescriptions[drainage]}

Requirements:

- Prefer species that are commonly suitable for Melbourne's temperate climate.
- Prefer Australian native species when reasonable, but other suitable species may also be included.
- Consider mature size, sunlight requirements, drainage and urban planting suitability.
- Do not guarantee that a plant will survive.
- Do not claim that the recommendation replaces professional horticultural or arborist advice.
- Keep the recommendations practical for a general community user.
- Do not recommend invasive species.
- Return concise information.

Return your answer ONLY as valid JSON using exactly this structure:

{
  "summary": "Short overall explanation",
  "recommendations": [
    {
      "commonName": "Plant common name",
      "scientificName": "Scientific name",
      "reason": "Why this plant may suit these conditions",
      "size": "Typical mature size description",
      "careTip": "One useful care or planting tip"
    },
    {
      "commonName": "Plant common name",
      "scientificName": "Scientific name",
      "reason": "Why this plant may suit these conditions",
      "size": "Typical mature size description",
      "careTip": "One useful care or planting tip"
    },
    {
      "commonName": "Plant common name",
      "scientificName": "Scientific name",
      "reason": "Why this plant may suit these conditions",
      "size": "Typical mature size description",
      "careTip": "One useful care or planting tip"
    }
  ],
  "disclaimer": "Short safety disclaimer"
}
`

      /* =========================
         6. Call Gemini
      ========================= */

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',

        contents: prompt,

        config: {
          responseMimeType: 'application/json',

          temperature: 0.4,
        },
      })

      const responseText = response.text

      if (!responseText || typeof responseText !== 'string') {
        throw new Error('Gemini returned an empty response.')
      }

      /* =========================
         7. Parse JSON
      ========================= */

      let recommendation

      try {
        recommendation = JSON.parse(responseText)
      } catch (error) {
        console.error('Gemini JSON parse error:', responseText)

        throw new Error('Gemini returned an invalid response format.')
      }

      /* =========================
         8. Basic Output Validation
      ========================= */

      if (
        !recommendation ||
        typeof recommendation.summary !== 'string' ||
        !Array.isArray(recommendation.recommendations) ||
        recommendation.recommendations.length < 1
      ) {
        throw new Error('Gemini response is missing recommendation data.')
      }

      /* =========================
         9. Return Result
      ========================= */

      return {
        success: true,

        recommendation,
      }
    } catch (error) {
      console.error('Plant recommendation error:', error)

      if (error instanceof HttpsError) {
        throw error
      }

      throw new HttpsError('internal', 'Unable to generate a plant recommendation at this time.')
    }
  },
)
