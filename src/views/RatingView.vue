<script setup>
import { ref, computed, onMounted } from 'vue'

import { collection, getDocs, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

import { onAuthStateChanged } from 'firebase/auth'

import { auth, db } from '../firebase'

/* =========================
   Rating Form State
========================= */

const selectedRating = ref(0)

const reviewText = ref('')

const ratings = ref([])

const successMessage = ref('')

const errorMessage = ref('')

const isSubmitting = ref(false)

const isLoading = ref(true)

const firebaseUser = ref(null)

/* =========================
   Format Firestore Date
========================= */

const formatDate = (timestamp) => {
  if (!timestamp) {
    return 'Just now'
  }

  try {
    return timestamp.toDate().toLocaleDateString()
  } catch {
    return 'Just now'
  }
}

/* =========================
   Load All Ratings
========================= */

const loadRatings = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const snapshot = await getDocs(collection(db, 'ratings'))

    ratings.value = snapshot.docs.map((document) => {
      const data = document.data()

      return {
        id: document.id,

        userId: data.userId || '',

        userName: data.userName || 'User',

        score: Number(data.score) || 0,

        review: data.review || '',

        date: formatDate(data.updatedAt || data.createdAt),

        createdAt: data.createdAt,

        updatedAt: data.updatedAt,
      }
    })
  } catch (error) {
    console.error('Failed to load ratings:', error)

    errorMessage.value = 'Unable to load ratings.'
  } finally {
    isLoading.value = false
  }
}

/* =========================
   Load Current User Rating
========================= */

const loadCurrentUserRating = async () => {
  if (!firebaseUser.value) {
    return
  }

  try {
    const ratingDocument = await getDoc(doc(db, 'ratings', firebaseUser.value.uid))

    if (ratingDocument.exists()) {
      const data = ratingDocument.data()

      selectedRating.value = Number(data.score) || 0

      reviewText.value = data.review || ''
    }
  } catch (error) {
    console.error('Failed to load current user rating:', error)
  }
}

/* =========================
   Select Rating
========================= */

const selectRating = (star) => {
  selectedRating.value = star

  errorMessage.value = ''

  successMessage.value = ''
}

/* =========================
   Submit / Update Rating
========================= */

const submitRating = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  /* Must be logged in */

  if (!firebaseUser.value) {
    errorMessage.value = 'Please log in before submitting a rating.'

    return
  }

  /* Rating Validation */

  if (selectedRating.value < 1 || selectedRating.value > 5) {
    errorMessage.value = 'Please select a rating between 1 and 5.'

    return
  }

  /* Clean Review */

  const cleanReview = reviewText.value.trim()

  if (cleanReview.length > 300) {
    errorMessage.value = 'Review must not exceed 300 characters.'

    return
  }

  isSubmitting.value = true

  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))

    const userName = String(currentUser?.name || firebaseUser.value.displayName || 'User')
      .trim()
      .slice(0, 50)

    const ratingReference = doc(db, 'ratings', firebaseUser.value.uid)

    const existingRating = await getDoc(ratingReference)

    const ratingData = {
      userId: firebaseUser.value.uid,

      userName,

      score: selectedRating.value,

      review: cleanReview.slice(0, 300),

      updatedAt: serverTimestamp(),
    }

    if (!existingRating.exists()) {
      ratingData.createdAt = serverTimestamp()
    }

    await setDoc(ratingReference, ratingData, {
      merge: true,
    })

    if (existingRating.exists()) {
      successMessage.value = 'Your rating has been updated.'
    } else {
      successMessage.value = 'Thank you for your feedback!'
    }

    await loadRatings()

    selectedRating.value = 0

    reviewText.value = ''
  } catch (error) {
    console.error('Rating submission failed:', error)

    errorMessage.value = 'Unable to submit your rating. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

/* =========================
   Average Rating
========================= */

const averageRating = computed(() => {
  if (ratings.value.length === 0) {
    return 0
  }

  const total = ratings.value.reduce((sum, rating) => sum + Number(rating.score), 0)

  return (total / ratings.value.length).toFixed(1)
})

/* =========================
   Authentication + Load
========================= */

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    firebaseUser.value = user

    await loadRatings()

    if (user) {
      await loadCurrentUserRating()
    }
  })
})
</script>

<template>
  <main class="rating-page">
    <div class="rating-container">
      <!-- =========================
           Header
      ========================== -->

      <header class="page-header">
        <p class="page-tag">SHARE YOUR EXPERIENCE</p>

        <h1>Community Rating</h1>

        <div class="title-line" aria-hidden="true"></div>

        <p>Tell us about your experience with the Urban Canopy website and community services.</p>
      </header>

      <!-- =========================
           Rating Summary
      ========================== -->

      <section class="rating-summary" aria-labelledby="rating-summary-heading">
        <h2 id="rating-summary-heading" class="sr-only">Community rating summary</h2>

        <div class="average-score" aria-label="Average community rating">
          {{ averageRating }}
        </div>

        <div class="stars-display" aria-hidden="true">★★★★★</div>

        <p>
          Based on
          {{ ratings.length }}

          rating<span v-if="ratings.length !== 1"> s </span>
        </p>
      </section>

      <!-- =========================
           Loading
      ========================== -->

      <p v-if="isLoading" class="loading-message" role="status" aria-live="polite">
        Loading ratings...
      </p>

      <!-- =========================
           Rating Form
      ========================== -->

      <section class="rating-card" aria-labelledby="rating-form-heading">
        <h2 id="rating-form-heading">Rate Your Experience</h2>

        <!-- Star Rating -->

        <div class="star-rating" role="radiogroup" aria-label="Select a rating from 1 to 5 stars">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            class="star-button"
            :class="{
              active: star <= selectedRating,
            }"
            role="radio"
            :aria-checked="selectedRating === star ? 'true' : 'false'"
            :aria-label="`${star} star${star === 1 ? '' : 's'}`"
            @click="selectRating(star)"
          >
            <span aria-hidden="true"> ★ </span>
          </button>
        </div>

        <!-- Selected Rating Text -->

        <p id="selected-rating-status" class="selected-text" role="status" aria-live="polite">
          <span v-if="selectedRating">
            You selected
            {{ selectedRating }}
            / 5
          </span>

          <span v-else> Select a rating </span>
        </p>

        <!-- Review -->

        <div class="review-group">
          <label for="review">
            Review
            <span class="optional-text"> (optional) </span>
          </label>

          <textarea
            id="review"
            v-model="reviewText"
            rows="5"
            maxlength="300"
            placeholder="Tell us about your experience..."
            aria-describedby="review-character-count"
          ></textarea>

          <small id="review-character-count">
            {{ reviewText.length }}
            / 300 characters
          </small>
        </div>

        <!-- Error -->

        <div
          v-if="errorMessage"
          id="rating-error"
          class="error-message"
          role="alert"
          aria-live="assertive"
        >
          {{ errorMessage }}
        </div>

        <!-- Success -->

        <div v-if="successMessage" class="success-message" role="status" aria-live="polite">
          {{ successMessage }}
        </div>

        <!-- Submit -->

        <button
          type="button"
          class="submit-button"
          :disabled="isSubmitting"
          :aria-busy="isSubmitting ? 'true' : 'false'"
          @click="submitRating"
        >
          {{ isSubmitting ? 'Submitting...' : 'Submit Rating' }}
        </button>
      </section>

      <!-- =========================
           Reviews
      ========================== -->

      <section class="reviews-section" aria-labelledby="feedback-heading">
        <h2 id="feedback-heading">Recent Feedback</h2>

        <div v-if="!isLoading && ratings.length === 0" class="empty-message" role="status">
          No ratings have been submitted yet.
        </div>

        <div v-else class="reviews-grid">
          <article
            v-for="rating in [...ratings].reverse()"
            :key="rating.id"
            class="review-card"
            :aria-label="`${rating.userName}, ${rating.score} out of 5 stars`"
          >
            <div class="review-header">
              <div>
                <h3>
                  {{ rating.userName }}
                </h3>

                <p class="review-date">
                  {{ rating.date }}
                </p>
              </div>

              <div class="review-score" :aria-label="`${rating.score} out of 5`">
                {{ rating.score }}
                / 5
              </div>
            </div>

            <div class="review-stars" aria-hidden="true">
              <span
                v-for="star in 5"
                :key="star"
                :class="{
                  filled: star <= rating.score,
                }"
              >
                ★
              </span>
            </div>

            <p v-if="rating.review" class="review-text">
              {{ rating.review }}
            </p>
          </article>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.rating-page {
  min-height: 100vh;

  padding: 70px 20px;

  background: #f7faf5;
}

.rating-container {
  max-width: 950px;

  margin: 0 auto;
}

/* =========================
   Header
========================= */

.page-header {
  margin-bottom: 45px;

  text-align: center;
}

.page-tag {
  margin-bottom: 10px;

  color: #5f8956;

  font-size: 13px;

  font-weight: 700;

  letter-spacing: 3px;
}

.page-header h1 {
  margin: 0;

  color: #2f6b3b;

  font-size: 48px;
}

.title-line {
  width: 70px;

  height: 4px;

  margin: 15px auto 18px;

  background: #6d9c63;

  border-radius: 10px;
}

.page-header p {
  color: #4d4d4d;

  line-height: 1.7;
}

/* =========================
   Rating Summary
========================= */

.rating-summary {
  margin-bottom: 30px;

  padding: 28px;

  text-align: center;

  background: #eef5ee;

  border: 1px solid #d4e2d1;

  border-radius: 18px;
}

.average-score {
  color: #2f6b3b;

  font-size: 58px;

  font-weight: 700;
}

.stars-display {
  margin: 5px 0 8px;

  color: #b97800;

  font-size: 28px;

  letter-spacing: 5px;
}

.rating-summary p {
  margin: 0;

  color: #4d4d4d;
}

/* =========================
   Loading
========================= */

.loading-message {
  margin-bottom: 20px;

  padding: 12px;

  text-align: center;

  color: #365d3d;

  background: #eef5ee;

  border-radius: 8px;
}

/* =========================
   Rating Card
========================= */

.rating-card {
  margin-bottom: 45px;

  padding: 35px;

  text-align: center;

  background: white;

  border: 1px solid #dce6d9;

  border-radius: 18px;

  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.06);
}

.rating-card h2 {
  margin-top: 0;

  color: #2f6b3b;
}

/* =========================
   Stars
========================= */

.star-rating {
  display: flex;

  justify-content: center;

  gap: 8px;

  margin: 25px 0 12px;
}

.star-button {
  min-width: 52px;

  min-height: 52px;

  padding: 2px;

  color: #8a8a8a;

  background: none;

  border: 2px solid transparent;

  border-radius: 8px;

  font-size: 46px;

  cursor: pointer;

  transition: 0.2s;
}

.star-button:hover,
.star-button.active {
  color: #b97800;

  transform: scale(1.06);
}

.star-button:focus-visible {
  outline: 3px solid #2f6b3b;

  outline-offset: 3px;

  border-color: #2f6b3b;
}

.selected-text {
  margin-bottom: 28px;

  color: #4d4d4d;

  font-weight: 600;
}

/* =========================
   Review
========================= */

.review-group {
  margin-bottom: 24px;

  text-align: left;
}

.review-group label {
  display: block;

  margin-bottom: 8px;

  color: #263c2b;

  font-weight: 700;
}

.optional-text {
  color: #595959;

  font-weight: 400;
}

.review-group textarea {
  width: 100%;

  padding: 13px;

  resize: vertical;

  color: #222;

  background: white;

  font-family: inherit;

  font-size: 16px;

  border: 1px solid #969f94;

  border-radius: 8px;

  outline: none;
}

.review-group textarea:focus-visible {
  outline: 3px solid #2f6b3b;

  outline-offset: 2px;

  border-color: #2f6b3b;
}

.review-group small {
  display: block;

  margin-top: 6px;

  text-align: right;

  color: #595959;
}

/* =========================
   Submit
========================= */

.submit-button {
  padding: 13px 28px;

  color: white;

  background: #2f6b3b;

  border: none;

  border-radius: 8px;

  font-family: inherit;

  font-size: 16px;

  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;
}

.submit-button:hover:not(:disabled) {
  background: #24562f;

  transform: translateY(-2px);
}

.submit-button:focus-visible {
  outline: 3px solid #173f22;

  outline-offset: 3px;
}

.submit-button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* =========================
   Messages
========================= */

.success-message {
  margin: 0 0 20px;

  padding: 14px;

  color: #24562f;

  background: #e7f3e8;

  border: 1px solid #b7d1b9;

  border-radius: 8px;

  font-weight: 600;
}

.error-message {
  margin: 0 0 20px;

  padding: 14px;

  color: #8f1c13;

  background: #fdecec;

  border: 1px solid #e5aaa6;

  border-radius: 8px;

  font-weight: 600;
}

/* =========================
   Reviews
========================= */

.reviews-section h2 {
  margin-bottom: 25px;

  color: #2f6b3b;
}

.reviews-grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 20px;
}

.review-card {
  padding: 24px;

  background: white;

  border: 1px solid #dce6d9;

  border-radius: 15px;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
}

.review-header {
  display: flex;

  justify-content: space-between;

  gap: 20px;
}

.review-header h3 {
  margin: 0;

  color: #253b2a;
}

.review-date {
  margin-top: 4px;

  color: #595959;

  font-size: 13px;
}

.review-score {
  color: #2f6b3b;

  font-weight: 700;
}

.review-stars {
  margin: 12px 0;

  color: #8a8a8a;
}

.review-stars .filled {
  color: #b97800;
}

.review-text {
  color: #4d4d4d;

  line-height: 1.7;
}

.empty-message {
  padding: 30px;

  text-align: center;

  color: #595959;

  background: white;

  border: 1px solid #dce6d9;

  border-radius: 12px;
}

/* =========================
   Screen Reader Only
========================= */

.sr-only {
  position: absolute;

  width: 1px;

  height: 1px;

  padding: 0;

  margin: -1px;

  overflow: hidden;

  clip: rect(0, 0, 0, 0);

  white-space: nowrap;

  border: 0;
}

/* =========================
   Mobile
========================= */

@media (max-width: 700px) {
  .rating-page {
    padding: 45px 16px;
  }

  .page-header h1 {
    font-size: 36px;
  }

  .average-score {
    font-size: 48px;
  }

  .rating-card {
    padding: 26px 20px;
  }

  .star-rating {
    gap: 3px;
  }

  .star-button {
    min-width: 46px;

    min-height: 46px;

    font-size: 38px;
  }

  .reviews-grid {
    grid-template-columns: 1fr;
  }
}
</style>
