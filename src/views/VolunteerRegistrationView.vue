<script setup>
import { ref } from 'vue'

const formData = ref({
  name: '',
  email: '',
  activity: '',
  availability: '',
  experience: '',
  reason: '',
})

const submitted = ref(false)

const submitForm = () => {
  const existingVolunteers = JSON.parse(localStorage.getItem('volunteers')) || []

  existingVolunteers.push({
    ...formData.value,
  })

  localStorage.setItem('volunteers', JSON.stringify(existingVolunteers))

  submitted.value = true

  formData.value = {
    name: '',
    email: '',
    activity: '',
    availability: '',
    experience: '',
    reason: '',
  }
}

const clearForm = () => {
  formData.value = {
    name: '',
    email: '',
    activity: '',
    availability: '',
    experience: '',
    reason: '',
  }

  submitted.value = false
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
      <div class="form-group">
        <label for="name">Name</label>
        <input id="name" v-model="formData.name" type="text" required />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="formData.email" type="email" required />
      </div>

      <div class="form-group">
        <label for="activity">Preferred Activity</label>

        <select id="activity" v-model="formData.activity" required>
          <option disabled value="">Please select an activity</option>

          <option>Community Tree Planting</option>
          <option>Community Garden Day</option>
          <option>Biodiversity Walk</option>
        </select>
      </div>

      <div class="form-group">
        <label for="availability">Availability</label>

        <select id="availability" v-model="formData.availability">
          <option value="">Select availability</option>

          <option>Weekdays</option>
          <option>Weekends</option>
          <option>Flexible</option>
        </select>
      </div>

      <div class="form-group">
        <label for="experience"> Previous Volunteer Experience </label>

        <textarea id="experience" v-model="formData.experience" rows="4"></textarea>
      </div>

      <div class="form-group">
        <label for="reason"> Why would you like to volunteer? </label>

        <textarea id="reason" v-model="formData.reason" rows="4"></textarea>
      </div>

      <div class="buttons">
        <button type="submit" class="submit-button">Submit</button>

        <button type="button" class="clear-button" @click="clearForm">Clear</button>
      </div>
    </form>

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
  font-size: 42px;
  margin-bottom: 20px;
}

.intro {
  font-size: 18px;
  line-height: 1.7;
  color: #444;
  margin-bottom: 35px;
}

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
  font-weight: bold;
  margin-bottom: 8px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.buttons {
  display: flex;
  gap: 12px;
}

.submit-button,
.clear-button {
  padding: 12px 22px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.submit-button {
  background: #2f6b3b;
  color: white;
}

.clear-button {
  background: #ddd;
}

.success-message {
  margin-top: 25px;
  padding: 18px;
  background: #e7f3e8;
  border-radius: 8px;
  color: #2f6b3b;
}

.back-button {
  display: inline-block;
  margin-top: 30px;
  padding: 12px 20px;
  background: #2f6b3b;
  color: white;
  text-decoration: none;
  border-radius: 6px;
}
</style>
