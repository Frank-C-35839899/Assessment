const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { defineSecret } = require('firebase-functions/params')

const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

const { Resend } = require('resend')

/* =========================
   Firebase Admin
========================= */

initializeApp()

const db = getFirestore()

/* =========================
   Firebase Secret
========================= */

const resendApiKey = defineSecret('RESEND_API_KEY')

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
