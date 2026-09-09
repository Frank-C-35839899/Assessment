<script setup>
import { ref } from 'vue'

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const successMessage = ref('')

// Hash password before storing it
const hashPassword = async (password) => {
  const data = new TextEncoder().encode(password)

  const hashBuffer = await crypto.subtle.digest('SHA-256', data)

  const hashArray = Array.from(new Uint8Array(hashBuffer))

  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

// Validate form
const validateForm = () => {
  errors.value = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  let valid = true

  // Name
  if (formData.value.name.trim().length < 2) {
    errors.value.name = 'Name must contain at least 2 characters.'
    valid = false
  }

  // Email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(formData.value.email)) {
    errors.value.email = 'Please enter a valid email address.'
    valid = false
  }

  // Password
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

  if (!passwordPattern.test(formData.value.password)) {
    errors.value.password =
      'Password must be at least 8 characters and include uppercase, lowercase and a number.'
    valid = false
  }

  // Confirm password
  if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match.'
    valid = false
  }

  return valid
}

// Register
const registerUser = async () => {
  successMessage.value = ''

  if (!validateForm()) {
    return
  }

  // Read existing users
  const users = JSON.parse(localStorage.getItem('users')) || []

  // Check duplicate email
  const emailExists = users.some(
    (user) => user.email.toLowerCase() === formData.value.email.trim().toLowerCase(),
  )

  if (emailExists) {
    errors.value.email = 'An account with this email already exists.'
    return
  }

  const hashedPassword = await hashPassword(formData.value.password)

  const newUser = {
    id: Date.now(),
    name: formData.value.name.trim(),
    email: formData.value.email.trim().toLowerCase(),
    password: hashedPassword,
  }

  users.push(newUser)

  localStorage.setItem('users', JSON.stringify(users))

  successMessage.value = 'Registration successful! You can now log in.'

  clearForm()
}

const clearForm = () => {
  formData.value = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  errors.value = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  }
}
</script>

<template>
  <div class="register-page">
    <div class="register-container">
      <div class="page-header">
        <p class="page-tag">JOIN GREEN MELBOURNE</p>

        <h1>Create an Account</h1>

        <div class="title-line"></div>

        <p>
          Register to participate in community activities and connect with Melbourne's urban
          greening community.
        </p>
      </div>

      <form class="register-form" @submit.prevent="registerUser">
        <!-- Name -->
        <div class="form-group">
          <label for="name"> Name </label>

          <input id="name" v-model="formData.name" type="text" placeholder="Enter your name" />

          <p v-if="errors.name" class="error-message">
            {{ errors.name }}
          </p>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email"> Email </label>

          <input id="email" v-model="formData.email" type="email" placeholder="Enter your email" />

          <p v-if="errors.email" class="error-message">
            {{ errors.email }}
          </p>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password"> Password </label>

          <input
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="Create a password"
          />

          <p v-if="errors.password" class="error-message">
            {{ errors.password }}
          </p>
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label for="confirmPassword"> Confirm Password </label>

          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            placeholder="Enter your password again"
          />

          <p v-if="errors.confirmPassword" class="error-message">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <button type="submit" class="register-button">Register</button>
      </form>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  padding: 70px 20px;
  background: #f7faf5;
}

.register-container {
  max-width: 650px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 35px;
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
  font-size: 44px;
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

.register-form {
  padding: 35px;
  background: white;

  border: 1px solid #e4ebe1;
  border-radius: 18px;

  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.06);
}

.form-group {
  margin-bottom: 22px;
}

.form-group label {
  display: block;

  margin-bottom: 8px;

  font-weight: 600;

  color: #263c2b;
}

.form-group input {
  width: 100%;

  padding: 13px 14px;

  font-size: 16px;

  border: 1px solid #ccd7ca;
  border-radius: 8px;

  outline: none;

  transition: 0.2s;
}

.form-group input:focus {
  border-color: #6f9f75;

  box-shadow: 0 0 0 3px rgba(111, 159, 117, 0.15);
}

.error-message {
  margin-top: 7px;

  color: #b42318;

  font-size: 14px;
}

.register-button {
  width: 100%;

  padding: 14px;

  border: none;
  border-radius: 8px;

  background: #2f6b3b;
  color: white;

  font-size: 16px;
  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;
}

.register-button:hover {
  background: #25552f;
}

.success-message {
  margin-top: 24px;

  padding: 16px;

  text-align: center;

  color: #2f6b3b;
  background: #e7f3e8;

  border-radius: 8px;
}

@media (max-width: 600px) {
  .register-page {
    padding: 45px 16px;
  }

  .page-header h1 {
    font-size: 34px;
  }

  .register-form {
    padding: 25px 20px;
  }
}
</style>
