<script setup>
import { ref } from 'vue'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const formData = ref({
  name: '',
  email: '',
  activity: '',
  availability: '',
  experience: '',
  reason: '',
})

const errors = ref({
  name: '',
  email: '',
  activity: '',
  availability: '',
  experience: '',
  reason: '',
})

const submitted = ref(false)
const submitError = ref('')
const isSubmitting = ref(false)

/* =========================
   Validation
========================= */

const validateForm = () => {
  errors.value = {
    name: '',
    email: '',
    activity: '',
    availability: '',
    experience: '',
    reason: '',
  }

  let valid = true

  const name = formData.value.name.trim()

  const email = formData.value.email.trim()

  const availability = formData.value.availability.trim()

  const experience = formData.value.experience.trim()

  const reason = formData.value.reason.trim()

  // Name
  if (name.length < 2 || name.length > 50) {
    errors.value.name = 'Name must be between 2 and 50 characters.'

    valid = false
  }

  // Email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(email)) {
    errors.value.email = 'Please enter a valid email address.'

    valid = false
  }

  // Activity
  if (!formData.value.activity) {
    errors.value.activity = 'Please select an activity.'

    valid = false
  }

  // Availability
  if (availability.length < 2) {
    errors.value.availability = 'Please provide your availability.'

    valid = false
  }

  // Experience
  if (experience.length > 300) {
    errors.value.experience = 'Experience must not exceed 300 characters.'

    valid = false
  }

  // Reason
  if (reason.length > 300) {
    errors.value.reason = 'Reason must not exceed 300 characters.'

    valid = false
  }

  return valid
}

/* =========================
   Submit to Firestore
========================= */

const submitForm = async () => {
  submitted.value = false
  submitError.value = ''

  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const newVolunteer = {
      name: formData.value.name.trim().slice(0, 50),

      email: formData.value.email.trim().toLowerCase(),

      activity: formData.value.activity,

      availability: formData.value.availability.trim().slice(0, 100),

      experience: formData.value.experience.trim().slice(0, 300),

      reason: formData.value.reason.trim().slice(0, 300),

      createdAt: serverTimestamp(),
    }

    await addDoc(collection(db, 'volunteers'), newVolunteer)

    clearForm()

    submitted.value = true
  } catch (error) {
    console.error('Volunteer submission failed:', error)

    submitError.value = 'Unable to submit your registration. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

/* =========================
   Clear Form
========================= */

const clearForm = () => {
  formData.value = {
    name: '',
    email: '',
    activity: '',
    availability: '',
    experience: '',
    reason: '',
  }

  errors.value = {
    name: '',
    email: '',
    activity: '',
    availability: '',
    experience: '',
    reason: '',
  }

  submitError.value = ''
}
</script>

<template>
  <div class="registration-page">
    <h1>Volunteer Registration</h1>

    <p class="intro">
      Complete the form below to express your interest in volunteering for urban greening and
      biodiversity activities.
    </p>

    <form class="registration-form" @submit.prevent="submitForm">
      <!-- Name -->
      <div class="form-group">
        <label for="name"> Name </label>

        <input
          id="name"
          v-model="formData.name"
          type="text"
          maxlength="50"
          placeholder="Enter your name"
          required
        />

        <p v-if="errors.name" class="error-message">
          {{ errors.name }}
        </p>
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="email"> Email </label>

        <input
          id="email"
          v-model="formData.email"
          type="email"
          placeholder="Enter your email"
          autocomplete="email"
          required
        />

        <p v-if="errors.email" class="error-message">
          {{ errors.email }}
        </p>
      </div>

      <!-- Activity -->
      <div class="form-group">
        <label for="activity"> Preferred Activity </label>

        <select id="activity" v-model="formData.activity" required>
          <option disabled value="">Please select an activity</option>

          <option>Community Tree Planting</option>

          <option>Community Garden Day</option>

          <option>Biodiversity Walk</option>
        </select>

        <p v-if="errors.activity" class="error-message">
          {{ errors.activity }}
        </p>
      </div>

      <!-- Availability -->
      <div class="form-group">
        <label for="availability"> Availability </label>

        <select id="availability" v-model="formData.availability" required>
          <option disabled value="">Select availability</option>

          <option>Weekdays</option>

          <option>Weekends</option>

          <option>Flexible</option>
        </select>

        <p v-if="errors.availability" class="error-message">
          {{ errors.availability }}
        </p>
      </div>

      <!-- Experience -->
      <div class="form-group">
        <label for="experience"> Previous Volunteer Experience </label>

        <textarea
          id="experience"
          v-model="formData.experience"
          rows="4"
          maxlength="300"
          placeholder="Describe any previous experience"
        ></textarea>

        <p class="character-count">{{ formData.experience.length }} / 300</p>

        <p v-if="errors.experience" class="error-message">
          {{ errors.experience }}
        </p>
      </div>

      <!-- Reason -->
      <div class="form-group">
        <label for="reason"> Why would you like to volunteer? </label>

        <textarea
          id="reason"
          v-model="formData.reason"
          rows="4"
          maxlength="300"
          placeholder="Tell us why you would like to volunteer"
        ></textarea>

        <p class="character-count">{{ formData.reason.length }} / 300</p>

        <p v-if="errors.reason" class="error-message">
          {{ errors.reason }}
        </p>
      </div>

      <!-- Submit Error -->
      <p v-if="submitError" class="submit-error">
        {{ submitError }}
      </p>

      <!-- Buttons -->
      <div class="buttons">
        <button type="submit" class="submit-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </button>

        <button type="button" class="clear-button" :disabled="isSubmitting" @click="clearForm">
          Clear
        </button>
      </div>
    </form>

    <!-- Success -->
    <div v-if="submitted" class="success-message">
      Thank you for registering your interest as a volunteer. We will contact you with more
      information about upcoming activities.
    </div>

    <router-link to="/" class="back-button"> ← Back to Home </router-link>
  </div>
</template>

<style scoped>
.registration-page {
  max-width: 850px;

  margin: 0 auto;

  padding: 80px 30px 60px;
}

.registration-page h1 {
  margin-bottom: 20px;

  color: #2f6b3b;

  font-size: 42px;
}

.intro {
  margin-bottom: 35px;

  color: #444;

  font-size: 18px;

  line-height: 1.7;
}

/* =========================
   Form
========================= */

.registration-form {
  padding: 32px;

  background: #f8faf7;

  border: 1px solid #ddd;

  border-radius: 14px;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.form-group {
  display: flex;

  flex-direction: column;

  margin-bottom: 22px;
}

.form-group label {
  margin-bottom: 8px;

  color: #263c2b;

  font-weight: 700;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;

  padding: 12px;

  font-family: inherit;

  font-size: 16px;

  background: white;

  border: 1px solid #ccc;

  border-radius: 6px;

  outline: none;

  transition: 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #6f9f75;

  box-shadow: 0 0 0 3px rgba(111, 159, 117, 0.15);
}

.form-group textarea {
  resize: vertical;
}

/* =========================
   Validation
========================= */

.error-message {
  margin-top: 7px;
  margin-bottom: 0;

  color: #b42318;

  font-size: 14px;
}

.character-count {
  margin: 6px 0 0;

  text-align: right;

  color: #777;

  font-size: 12px;
}

.submit-error {
  margin-bottom: 18px;

  padding: 12px 14px;

  background: #fce8e6;

  color: #b42318;

  border-radius: 6px;

  font-size: 14px;
}

/* =========================
   Buttons
========================= */

.buttons {
  display: flex;

  gap: 12px;
}

.submit-button,
.clear-button {
  padding: 12px 22px;

  border: none;

  border-radius: 6px;

  font-family: inherit;

  font-size: 15px;

  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;
}

.submit-button {
  background: #2f6b3b;

  color: white;
}

.submit-button:hover:not(:disabled) {
  background: #25552f;
}

.clear-button {
  background: #ddd;

  color: #333;
}

.clear-button:hover:not(:disabled) {
  background: #ccc;
}

.submit-button:disabled,
.clear-button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* =========================
   Messages
========================= */

.success-message {
  margin-top: 25px;

  padding: 18px;

  background: #e7f3e8;

  color: #2f6b3b;

  border-radius: 8px;

  line-height: 1.6;
}

/* =========================
   Back Button
========================= */

.back-button {
  display: inline-block;

  margin-top: 30px;

  padding: 12px 20px;

  background: #2f6b3b;

  color: white;

  text-decoration: none;

  border-radius: 6px;

  transition: 0.2s;
}

.back-button:hover {
  background: #25552f;
}

/* =========================
   Responsive
========================= */

@media (max-width: 600px) {
  .registration-page {
    padding: 50px 16px;
  }

  .registration-page h1 {
    font-size: 34px;
  }

  .registration-form {
    padding: 24px 18px;
  }

  .buttons {
    flex-direction: column;
  }

  .submit-button,
  .clear-button {
    width: 100%;
  }
}
</style>
