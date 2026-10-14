<script setup>
import { ref } from 'vue'

import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

import { db } from '../firebase'

/* =========================
   Form State
========================= */

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

  /* Name */

  if (name.length < 2 || name.length > 50) {
    errors.value.name = 'Name must be between 2 and 50 characters.'

    valid = false
  }

  /* Email */

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(email)) {
    errors.value.email = 'Please enter a valid email address.'

    valid = false
  }

  /* Activity */

  if (!formData.value.activity) {
    errors.value.activity = 'Please select an activity.'

    valid = false
  }

  /* Availability */

  if (availability.length < 2) {
    errors.value.availability = 'Please provide your availability.'

    valid = false
  }

  /* Experience */

  if (experience.length > 300) {
    errors.value.experience = 'Experience must not exceed 300 characters.'

    valid = false
  }

  /* Reason */

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

  submitted.value = false
}
</script>

<template>
  <main class="registration-page">
    <!-- =========================
         Header
    ========================== -->

    <header class="page-header">
      <p class="page-tag">VOLUNTEER WITH US</p>

      <h1>Volunteer Registration</h1>

      <div class="title-line" aria-hidden="true"></div>

      <p class="intro">
        Complete the form below to express your interest in volunteering for urban greening and
        biodiversity activities.
      </p>
    </header>

    <!-- =========================
         Form
    ========================== -->

    <section class="registration-card" aria-labelledby="volunteer-form-heading">
      <h2 id="volunteer-form-heading" class="sr-only">Volunteer registration form</h2>

      <form class="registration-form" novalidate @submit.prevent="submitForm">
        <!-- =========================
             Name
        ========================== -->

        <div class="form-group">
          <label for="name"> Name </label>

          <input
            id="name"
            v-model="formData.name"
            type="text"
            maxlength="50"
            placeholder="Enter your name"
            autocomplete="name"
            required
            :aria-invalid="errors.name ? 'true' : 'false'"
            :aria-describedby="errors.name ? 'volunteer-name-error' : undefined"
          />

          <p v-if="errors.name" id="volunteer-name-error" class="error-message" role="alert">
            {{ errors.name }}
          </p>
        </div>

        <!-- =========================
             Email
        ========================== -->

        <div class="form-group">
          <label for="email"> Email </label>

          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="Enter your email"
            autocomplete="email"
            required
            :aria-invalid="errors.email ? 'true' : 'false'"
            :aria-describedby="errors.email ? 'volunteer-email-error' : undefined"
          />

          <p v-if="errors.email" id="volunteer-email-error" class="error-message" role="alert">
            {{ errors.email }}
          </p>
        </div>

        <!-- =========================
             Activity
        ========================== -->

        <div class="form-group">
          <label for="activity"> Preferred Activity </label>

          <select
            id="activity"
            v-model="formData.activity"
            required
            :aria-invalid="errors.activity ? 'true' : 'false'"
            :aria-describedby="errors.activity ? 'volunteer-activity-error' : undefined"
          >
            <option disabled value="">Please select an activity</option>

            <option>Community Tree Planting</option>

            <option>Community Garden Day</option>

            <option>Biodiversity Walk</option>
          </select>

          <p
            v-if="errors.activity"
            id="volunteer-activity-error"
            class="error-message"
            role="alert"
          >
            {{ errors.activity }}
          </p>
        </div>

        <!-- =========================
             Availability
        ========================== -->

        <div class="form-group">
          <label for="availability"> Availability </label>

          <select
            id="availability"
            v-model="formData.availability"
            required
            :aria-invalid="errors.availability ? 'true' : 'false'"
            :aria-describedby="errors.availability ? 'volunteer-availability-error' : undefined"
          >
            <option disabled value="">Select availability</option>

            <option>Weekdays</option>

            <option>Weekends</option>

            <option>Flexible</option>
          </select>

          <p
            v-if="errors.availability"
            id="volunteer-availability-error"
            class="error-message"
            role="alert"
          >
            {{ errors.availability }}
          </p>
        </div>

        <!-- =========================
             Experience
        ========================== -->

        <div class="form-group">
          <label for="experience"> Previous Volunteer Experience </label>

          <textarea
            id="experience"
            v-model="formData.experience"
            rows="4"
            maxlength="300"
            placeholder="Describe any previous experience"
            aria-describedby="experience-count volunteer-experience-error"
            :aria-invalid="errors.experience ? 'true' : 'false'"
          ></textarea>

          <p id="experience-count" class="character-count">
            {{ formData.experience.length }}
            / 300 characters
          </p>

          <p
            v-if="errors.experience"
            id="volunteer-experience-error"
            class="error-message"
            role="alert"
          >
            {{ errors.experience }}
          </p>
        </div>

        <!-- =========================
             Reason
        ========================== -->

        <div class="form-group">
          <label for="reason"> Why would you like to volunteer? </label>

          <textarea
            id="reason"
            v-model="formData.reason"
            rows="4"
            maxlength="300"
            placeholder="Tell us why you would like to volunteer"
            aria-describedby="reason-count volunteer-reason-error"
            :aria-invalid="errors.reason ? 'true' : 'false'"
          ></textarea>

          <p id="reason-count" class="character-count">
            {{ formData.reason.length }}
            / 300 characters
          </p>

          <p v-if="errors.reason" id="volunteer-reason-error" class="error-message" role="alert">
            {{ errors.reason }}
          </p>
        </div>

        <!-- =========================
             Submission Error
        ========================== -->

        <div v-if="submitError" class="submit-error" role="alert" aria-live="assertive">
          {{ submitError }}
        </div>

        <!-- =========================
             Buttons
        ========================== -->

        <div class="buttons">
          <button type="submit" class="submit-button" :disabled="isSubmitting">
            {{ isSubmitting ? 'Submitting...' : 'Submit' }}
          </button>

          <button type="button" class="clear-button" :disabled="isSubmitting" @click="clearForm">
            Clear
          </button>
        </div>
      </form>
    </section>

    <!-- =========================
         Success Message
    ========================== -->

    <div v-if="submitted" class="success-message" role="status" aria-live="polite">
      Thank you for registering your interest as a volunteer. We will contact you with more
      information about upcoming activities.
    </div>

    <!-- =========================
         Back Link
    ========================== -->

    <router-link to="/" class="back-button"> ← Back to Home </router-link>
  </main>
</template>

<style scoped>
.registration-page {
  max-width: 850px;

  margin: 0 auto;

  padding: 70px 30px 60px;
}

/* =========================
   Header
========================= */

.page-header {
  margin-bottom: 35px;

  text-align: center;
}

.page-tag {
  margin: 0 0 10px;

  color: #3f6338;

  font-size: 13px;

  font-weight: 700;

  letter-spacing: 3px;
}

.page-header h1 {
  margin: 0;

  color: #2f6b3b;

  font-size: 42px;
}

.title-line {
  width: 70px;

  height: 4px;

  margin: 15px auto 18px;

  background: #6d9c63;

  border-radius: 10px;
}

.intro {
  margin: 0;

  color: #4d4d4d;

  font-size: 18px;

  line-height: 1.7;
}

/* =========================
   Form Card
========================= */

.registration-card {
  padding: 32px;

  background: #f8faf7;

  border: 1px solid #d9e2d7;

  border-radius: 14px;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.registration-form {
  width: 100%;
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

  color: #222;

  background: white;

  font-family: inherit;

  font-size: 16px;

  border: 1px solid #969f94;

  border-radius: 6px;

  outline: none;

  transition: 0.2s;
}

.form-group textarea {
  resize: vertical;
}

/* =========================
   Focus
========================= */

.form-group input:focus-visible,
.form-group select:focus-visible,
.form-group textarea:focus-visible {
  outline: 3px solid #2f6b3b;

  outline-offset: 2px;

  border-color: #2f6b3b;
}

/* =========================
   Errors
========================= */

.error-message {
  margin: 7px 0 0;

  color: #971f16;

  font-size: 14px;

  font-weight: 600;
}

.character-count {
  margin: 6px 0 0;

  text-align: right;

  color: #595959;

  font-size: 13px;
}

.submit-error {
  margin-bottom: 18px;

  padding: 12px 14px;

  color: #8f1c13;

  background: #fdecec;

  border: 1px solid #e5aaa6;

  border-radius: 7px;

  font-weight: 600;
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
  background: #24562f;
}

.clear-button {
  background: #d9ded7;

  color: #222;
}

.clear-button:hover:not(:disabled) {
  background: #c8cec6;
}

.submit-button:focus-visible,
.clear-button:focus-visible,
.back-button:focus-visible {
  outline: 3px solid #2f6b3b;

  outline-offset: 3px;
}

.submit-button:disabled,
.clear-button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* =========================
   Success
========================= */

.success-message {
  margin-top: 25px;

  padding: 18px;

  color: #24562f;

  background: #e7f3e8;

  border: 1px solid #b7d1b9;

  border-radius: 8px;

  line-height: 1.6;

  font-weight: 600;
}

/* =========================
   Back Link
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
  background: #24562f;
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

@media (max-width: 600px) {
  .registration-page {
    padding: 50px 16px;
  }

  .page-header h1 {
    font-size: 34px;
  }

  .registration-card {
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
