<script setup>
import { ref } from 'vue'

import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'

import { doc, getDoc, setDoc } from 'firebase/firestore'

import { auth, db } from '../firebase'

/* =========================
   Form State
========================= */

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

const generalError = ref('')

const isRegistering = ref(false)

const isGoogleRegistering = ref(false)

/* =========================
   Validation
========================= */

const validateForm = () => {
  errors.value = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  generalError.value = ''

  let valid = true

  // Name
  if (formData.value.name.trim().length < 2) {
    errors.value.name = 'Name must contain at least 2 characters.'

    valid = false
  }

  // Email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(formData.value.email.trim())) {
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

/* =========================
   Email / Password Register
========================= */

const registerUser = async () => {
  successMessage.value = ''
  generalError.value = ''

  if (!validateForm()) {
    return
  }

  isRegistering.value = true

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.value.email.trim().toLowerCase(),
      formData.value.password,
    )

    const firebaseUser = userCredential.user

    await updateProfile(firebaseUser, {
      displayName: formData.value.name.trim().slice(0, 50),
    })

    await setDoc(doc(db, 'users', firebaseUser.uid), {
      name: formData.value.name.trim().slice(0, 50),

      email: formData.value.email.trim().toLowerCase(),

      role: 'user',

      provider: 'password',
    })

    successMessage.value = 'Registration successful! You can now log in.'

    clearForm()
  } catch (error) {
    console.error('Registration failed:', error)

    if (error.code === 'auth/email-already-in-use') {
      errors.value.email = 'An account with this email already exists.'
    } else if (error.code === 'auth/invalid-email') {
      errors.value.email = 'Please enter a valid email address.'
    } else if (error.code === 'auth/weak-password') {
      errors.value.password = 'The password is too weak.'
    } else {
      generalError.value = 'Registration failed. Please try again.'
    }
  } finally {
    isRegistering.value = false
  }
}

/* =========================
   Google Register
========================= */

const registerWithGoogle = async () => {
  successMessage.value = ''
  generalError.value = ''

  isGoogleRegistering.value = true

  try {
    const provider = new GoogleAuthProvider()

    const result = await signInWithPopup(auth, provider)

    const firebaseUser = result.user

    const userReference = doc(db, 'users', firebaseUser.uid)

    const userSnapshot = await getDoc(userReference)

    let userData

    /* =========================
         First Google Registration
      ========================= */

    if (!userSnapshot.exists()) {
      userData = {
        name: firebaseUser.displayName || 'Google User',

        email: firebaseUser.email || '',

        role: 'user',

        provider: 'google',
      }

      await setDoc(userReference, userData)
    } else {
      userData = userSnapshot.data()
    }

    const currentUser = {
      id: firebaseUser.uid,

      name: userData.name || firebaseUser.displayName || 'User',

      email: firebaseUser.email,

      role: userData.role || 'user',
    }

    localStorage.setItem('currentUser', JSON.stringify(currentUser))

    successMessage.value = 'Google registration successful! Redirecting...'

    setTimeout(() => {
      window.location.href = '/'
    }, 700)
  } catch (error) {
    console.error('Google registration failed:', error)

    if (error.code === 'auth/popup-closed-by-user') {
      generalError.value = 'Google registration was cancelled.'
    } else if (error.code === 'auth/popup-blocked') {
      generalError.value = 'The Google sign-in popup was blocked by your browser.'
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      generalError.value = 'An account already exists with this email using another sign-in method.'
    } else {
      generalError.value = 'Google registration failed. Please try again.'
    }
  } finally {
    isGoogleRegistering.value = false
  }
}

/* =========================
   Clear Form
========================= */

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

  generalError.value = ''
}
</script>

<template>
  <div class="register-page">
    <div class="register-container">
      <div class="page-header">
        <p class="page-tag">JOIN URBAN CANOPY</p>

        <h1>Create an Account</h1>

        <div class="title-line"></div>

        <p>
          Register to participate in community activities and connect with Melbourne's urban
          greening community.
        </p>
      </div>

      <div class="register-form">
        <!-- =========================
             Email / Password Form
        ========================== -->

        <form @submit.prevent="registerUser">
          <!-- Name -->

          <div class="form-group">
            <label for="name"> Name </label>

            <input
              id="name"
              v-model="formData.name"
              type="text"
              placeholder="Enter your name"
              maxlength="50"
              autocomplete="name"
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

          <!-- Password -->

          <div class="form-group">
            <label for="password"> Password </label>

            <input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="Create a password"
              autocomplete="new-password"
              required
            />

            <p class="password-hint">
              Minimum 8 characters with uppercase, lowercase and a number.
            </p>

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
              autocomplete="new-password"
              required
            />

            <p v-if="errors.confirmPassword" class="error-message">
              {{ errors.confirmPassword }}
            </p>
          </div>

          <!-- General Error -->

          <p v-if="generalError" class="general-error">
            {{ generalError }}
          </p>

          <!-- Register Button -->

          <button
            type="submit"
            class="register-button"
            :disabled="isRegistering || isGoogleRegistering"
          >
            {{ isRegistering ? 'Registering...' : 'Register' }}
          </button>
        </form>

        <!-- =========================
             Divider
        ========================== -->

        <div class="divider">
          <span></span>

          <p>OR</p>

          <span></span>
        </div>

        <!-- =========================
             Google Register
        ========================== -->

        <button
          type="button"
          class="google-button"
          :disabled="isRegistering || isGoogleRegistering"
          @click="registerWithGoogle"
        >
          <span class="google-icon"> G </span>

          <span>
            {{ isGoogleRegistering ? 'Connecting to Google...' : 'Continue with Google' }}
          </span>
        </button>

        <!-- Login Link -->

        <p class="login-link">
          Already have an account?

          <router-link to="/login"> Login here </router-link>
        </p>
      </div>

      <!-- Success -->

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

/* =========================
   Header
========================= */

.page-header {
  margin-bottom: 35px;

  text-align: center;
}

.page-tag {
  margin-bottom: 10px;

  color: #7aa66d;

  font-size: 13px;

  font-weight: 700;

  letter-spacing: 3px;
}

.page-header h1 {
  margin: 0;

  color: #2f6b3b;

  font-size: 44px;
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

/* =========================
   Form Card
========================= */

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

  color: #263c2b;

  font-weight: 600;
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

/* =========================
   Validation
========================= */

.error-message {
  margin-top: 7px;

  color: #b42318;

  font-size: 14px;
}

.password-hint {
  margin-top: 6px;
  margin-bottom: 0;

  color: #444444;

  font-size: 13px;
}

.general-error {
  margin-bottom: 18px;

  padding: 12px 14px;

  background: #fdecec;

  color: #b42318;

  border: 1px solid #f3c7c4;

  border-radius: 8px;

  font-size: 14px;
}

/* =========================
   Register Button
========================= */

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

.register-button:hover:not(:disabled) {
  background: #25552f;
}

.register-button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* =========================
   Divider
========================= */

.divider {
  display: flex;

  align-items: center;

  gap: 15px;

  margin: 24px 0;
}

.divider span {
  flex: 1;

  height: 1px;

  background: #dfe5dd;
}

.divider p {
  margin: 0;

  color: #444444;

  font-size: 13px;

  font-weight: 700;
}

/* =========================
   Google Button
========================= */

.google-button {
  display: flex;

  width: 100%;

  align-items: center;

  justify-content: center;

  gap: 12px;

  padding: 13px;

  background: white;

  color: #333;

  border: 1px solid #cdd6cb;

  border-radius: 8px;

  font-size: 16px;

  font-weight: 600;

  cursor: pointer;

  transition: 0.2s;
}

.google-button:hover:not(:disabled) {
  background: #f8faf7;

  border-color: #9eb29a;
}

.google-button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

.google-icon {
  display: flex;

  width: 28px;

  height: 28px;

  align-items: center;

  justify-content: center;

  background: white;

  color: #4285f4;

  border: 1px solid #ddd;

  border-radius: 50%;

  font-size: 16px;

  font-weight: 800;
}

/* =========================
   Login Link
========================= */

.login-link {
  margin-top: 22px;

  text-align: center;

  color: #555;
}

.login-link a {
  color: #2f6b3b;

  font-weight: 600;

  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

/* =========================
   Success Message
========================= */

.success-message {
  margin-top: 24px;

  padding: 16px;

  text-align: center;

  color: #2f6b3b;

  background: #e7f3e8;

  border-radius: 8px;
}

/* =========================
   Mobile
========================= */

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
