<script setup>
import { ref, computed, onMounted } from 'vue'

const selectedRating = ref(0)
const reviewText = ref('')
const ratings = ref([])
const successMessage = ref('')

const loadRatings = () => {
  ratings.value = JSON.parse(localStorage.getItem('ratings')) || []

  const currentUser = JSON.parse(localStorage.getItem('currentUser'))

  if (currentUser) {
    const existingRating = ratings.value.find((rating) => rating.userId === currentUser.id)

    if (existingRating) {
      selectedRating.value = existingRating.score
      reviewText.value = existingRating.review
    }
  }
}

const submitRating = () => {
  successMessage.value = ''
  errorMessage.value = ''

  const currentUser = JSON.parse(localStorage.getItem('currentUser'))

  // Must be logged in
  if (!currentUser) {
    errorMessage.value = 'Please log in before submitting a rating.'
    return
  }

  // Rating must be between 1 and 5
  if (selectedRating.value < 1 || selectedRating.value > 5) {
    errorMessage.value = 'Please select a rating between 1 and 5.'
    return
  }

  // Remove unnecessary spaces
  const cleanReview = reviewText.value.trim()

  // Maximum review length
  if (cleanReview.length > 300) {
    errorMessage.value = 'Review must not exceed 300 characters.'
    return
  }

  const existingIndex = ratings.value.findIndex((rating) => rating.userId === currentUser.id)

  const ratingData = {
    id: existingIndex === -1 ? Date.now() : ratings.value[existingIndex].id,

    userId: currentUser.id,

    userName: String(currentUser.name).trim().slice(0, 50),

    score: selectedRating.value,

    review: cleanReview.slice(0, 300),

    date: new Date().toLocaleDateString(),
  }

  if (existingIndex === -1) {
    ratings.value.push(ratingData)

    successMessage.value = 'Thank you for your feedback!'
  } else {
    ratings.value[existingIndex] = ratingData

    successMessage.value = 'Your rating has been updated.'
  }

  localStorage.setItem('ratings', JSON.stringify(ratings.value))

  selectedRating.value = 0
  reviewText.value = ''
}

const averageRating = computed(() => {
  if (ratings.value.length === 0) {
    return 0
  }

  const total = ratings.value.reduce((sum, rating) => sum + rating.score, 0)

  return (total / ratings.value.length).toFixed(1)
})

onMounted(() => {
  loadRatings()
})

const errorMessage = ref('')
</script>

<template>
  <div class="rating-page">
    <div class="rating-container">
      <!-- Header -->
      <div class="page-header">
        <p class="page-tag">SHARE YOUR EXPERIENCE</p>

        <h1>Community Rating</h1>

        <div class="title-line"></div>

        <p>
          Tell us about your experience with the Green Melbourne website and community services.
        </p>
      </div>

      <!-- Rating summary -->
      <section class="rating-summary">
        <div class="average-score">
          {{ averageRating }}
        </div>

        <div class="stars-display">★★★★★</div>

        <p>
          Based on
          {{ ratings.length }}
          rating<span v-if="ratings.length !== 1">s</span>
        </p>
      </section>

      <!-- Rating form -->
      <section class="rating-card">
        <h2>Rate Your Experience</h2>

        <div class="star-rating">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            class="star-button"
            :class="{ active: star <= selectedRating }"
            @click="selectedRating = star"
          >
            ★
          </button>
        </div>

        <p class="selected-text">
          <span v-if="selectedRating"> You selected {{ selectedRating }} / 5 </span>

          <span v-else> Select a rating </span>
        </p>

        <div class="review-group">
          <label for="review"> Review (optional) </label>

          <textarea
            id="review"
            v-model="reviewText"
            rows="5"
            maxlength="300"
            placeholder="Tell us about your experience..."
          ></textarea>

          <small> {{ reviewText.length }} / 300 </small>
        </div>

        <button class="submit-button" @click="submitRating">Submit Rating</button>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
      </section>

      <!-- Reviews -->
      <section class="reviews-section">
        <h2>Recent Feedback</h2>

        <div v-if="ratings.length === 0" class="empty-message">
          No ratings have been submitted yet.
        </div>

        <div v-else class="reviews-grid">
          <article v-for="rating in [...ratings].reverse()" :key="rating.id" class="review-card">
            <div class="review-header">
              <div>
                <h3>{{ rating.userName }}</h3>
                <p class="review-date">
                  {{ rating.date }}
                </p>
              </div>

              <div class="review-score">{{ rating.score }} / 5</div>
            </div>

            <div class="review-stars">
              <span v-for="star in 5" :key="star" :class="{ filled: star <= rating.score }">
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
  </div>
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

.page-header {
  text-align: center;
  margin-bottom: 45px;
}

.page-tag {
  margin-bottom: 10px;

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 3px;

  color: #7aa66d;
}

.page-header h1 {
  margin: 0;

  font-size: 48px;

  color: #2f6b3b;
}

.title-line {
  width: 70px;
  height: 4px;

  margin: 15px auto 18px;

  background: #8fbe7f;

  border-radius: 10px;
}

.page-header p {
  color: #555;

  line-height: 1.7;
}

/* Rating summary */

.rating-summary {
  text-align: center;

  margin-bottom: 30px;

  padding: 28px;

  background: #eef5ee;

  border-radius: 18px;
}

.average-score {
  font-size: 58px;

  font-weight: 700;

  color: #2f6b3b;
}

.stars-display {
  margin: 5px 0 8px;

  font-size: 28px;

  letter-spacing: 5px;

  color: #e0aa36;
}

.rating-summary p {
  margin: 0;

  color: #555;
}

/* Form card */

.rating-card {
  padding: 35px;

  background: white;

  border: 1px solid #e4ebe1;

  border-radius: 18px;

  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.06);

  text-align: center;

  margin-bottom: 45px;
}

.rating-card h2 {
  margin-top: 0;

  color: #2f6b3b;
}

/* Stars */

.star-rating {
  display: flex;

  justify-content: center;

  gap: 8px;

  margin: 25px 0 12px;
}

.star-button {
  padding: 0;

  border: none;

  background: none;

  font-size: 46px;

  color: #d8d8d8;

  cursor: pointer;

  transition: 0.2s;
}

.star-button:hover,
.star-button.active {
  color: #e0aa36;

  transform: scale(1.08);
}

.selected-text {
  color: #666;

  margin-bottom: 28px;
}

/* Review */

.review-group {
  text-align: left;

  margin-bottom: 24px;
}

.review-group label {
  display: block;

  margin-bottom: 8px;

  font-weight: 600;

  color: #263c2b;
}

.review-group textarea {
  width: 100%;

  padding: 13px;

  resize: vertical;

  font-family: inherit;
  font-size: 16px;

  border: 1px solid #ccd7ca;

  border-radius: 8px;

  outline: none;
}

.review-group textarea:focus {
  border-color: #6f9f75;

  box-shadow: 0 0 0 3px rgba(111, 159, 117, 0.15);
}

.review-group small {
  display: block;

  margin-top: 6px;

  text-align: right;

  color: #777;
}

/* Submit */

.submit-button {
  padding: 13px 28px;

  border: none;

  border-radius: 8px;

  background: #2f6b3b;

  color: white;

  font-size: 16px;
  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;
}

.submit-button:hover {
  background: #25552f;

  transform: translateY(-2px);
}

.success-message {
  margin-top: 20px;

  padding: 14px;

  background: #e7f3e8;

  color: #2f6b3b;

  border-radius: 8px;
}

/* Reviews */

.reviews-section h2 {
  margin-bottom: 25px;

  color: #2f6b3b;
}

.reviews-grid {
  display: grid;

  grid-template-columns: repeat(2, 1fr);

  gap: 20px;
}

.review-card {
  padding: 24px;

  background: white;

  border: 1px solid #e4ebe1;

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

  color: #888;

  font-size: 13px;
}

.review-score {
  font-weight: 700;

  color: #2f6b3b;
}

.review-stars {
  margin: 12px 0;

  color: #d8d8d8;
}

.review-stars .filled {
  color: #e0aa36;
}

.review-text {
  color: #555;

  line-height: 1.7;
}

.empty-message {
  padding: 30px;

  text-align: center;

  background: white;

  border-radius: 12px;

  color: #777;
}

.error-message {
  margin-top: 20px;
  padding: 14px;

  background: #fdecec;
  color: #b42318;

  border: 1px solid #f3c7c4;
  border-radius: 8px;
}

/* Mobile */

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

  .star-button {
    font-size: 38px;
  }

  .reviews-grid {
    grid-template-columns: 1fr;
  }
}
</style>
