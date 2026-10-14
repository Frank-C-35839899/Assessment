<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

import { doc, getDoc, setDoc } from 'firebase/firestore'

import { auth, db } from '../firebase'

/* =========================
   Router
========================= */

const router = useRouter()

/* =========================
   Form State
========================= */

const formData = ref({
  email: '',
  password: '',
})

const errors = ref({
  email: '',
  password: '',
})

const generalError = ref('')

const successMessage = ref('')

const isLoggingIn = ref(false)

const isGoogleLoggingIn = ref(false)

/* =========================
   Validation
========================= */

const validateForm = () => {
  errors.value = {
    email: '',
    password: '',
  }

  generalError.value = ''

  let valid = true

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(formData.value.email.trim())) {
    errors.value.email = 'Please enter a valid email address.'

    valid = false
  }

  if (formData.value.password.length < 1) {
    errors.value.password = 'Please enter your password.'

    valid = false
  }

  return valid
}

/* =========================
   Load Firestore Profile
========================= */

const getUserProfile = async (firebaseUser) => {
  const userReference = doc(db, 'users', firebaseUser.uid)

  const userSnapshot = await getDoc(userReference)

  if (userSnapshot.exists()) {
    return userSnapshot.data()
  }

  /*
      If a Firebase account exists
      but Firestore profile does not,
      create a basic user profile.
    */

  const newUserData = {
    name: firebaseUser.displayName || 'User',

    email: firebaseUser.email || '',

    role: 'user',

    provider: firebaseUser.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'password',
  }

  await setDoc(userReference, newUserData)

  return newUserData
}

/* =========================
   Save Current User
========================= */

const saveCurrentUser = (firebaseUser, userData) => {
  const currentUser = {
    id: firebaseUser.uid,

    name: userData.name || firebaseUser.displayName || 'User',

    email: firebaseUser.email || '',

    role: userData.role || 'user',
  }

  localStorage.setItem('currentUser', JSON.stringify(currentUser))

  return currentUser
}

/* =========================
   Redirect After Login
========================= */

const redirectUser = async (currentUser) => {
  if (currentUser.role === 'admin') {
    await router.push('/admin')
  } else {
    await router.push('/')
  }
}

/* =========================
   Email / Password Login
========================= */

const loginUser = async () => {
  successMessage.value = ''

  generalError.value = ''

  if (!validateForm()) {
    return
  }

  isLoggingIn.value = true

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,

      formData.value.email.trim().toLowerCase(),

      formData.value.password,
    )

    const firebaseUser = userCredential.user

    const userData = await getUserProfile(firebaseUser)

    const currentUser = saveCurrentUser(firebaseUser, userData)

    successMessage.value = 'Login successful! Redirecting...'

    await redirectUser(currentUser)
  } catch (error) {
    console.error('Login failed:', error)

    if (
      error.code === 'auth/invalid-credential' ||
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/user-not-found'
    ) {
      generalError.value = 'Incorrect email or password.'
    } else if (error.code === 'auth/invalid-email') {
      errors.value.email = 'Please enter a valid email address.'
    } else if (error.code === 'auth/too-many-requests') {
      generalError.value = 'Too many login attempts. Please try again later.'
    } else {
      generalError.value = 'Unable to log in. Please try again.'
    }
  } finally {
    isLoggingIn.value = false
  }
}

/* =========================
   Google Login
========================= */

const loginWithGoogle = async () => {
  successMessage.value = ''

  generalError.value = ''

  isGoogleLoggingIn.value = true

  try {
    const provider = new GoogleAuthProvider()

    const result = await signInWithPopup(auth, provider)

    const firebaseUser = result.user

    const userData = await getUserProfile(firebaseUser)

    const currentUser = saveCurrentUser(firebaseUser, userData)

    successMessage.value = 'Google login successful! Redirecting...'

    await redirectUser(currentUser)
  } catch (error) {
    console.error('Google login failed:', error)

    if (error.code === 'auth/popup-closed-by-user') {
      generalError.value = 'Google login was cancelled.'
    } else if (error.code === 'auth/popup-blocked') {
      generalError.value = 'The Google login popup was blocked by your browser.'
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      generalError.value = 'An account already exists with this email using another sign-in method.'
    } else {
      generalError.value = 'Google login failed. Please try again.'
    }
  } finally {
    isGoogleLoggingIn.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <div class="login-container">
      <!-- =========================
           Header
      ========================== -->

      <header class="page-header">
        <p class="page-tag">WELCOME BACK</p>

        <h1>Login</h1>

        <div class="title-line" aria-hidden="true"></div>

        <p>
          Sign in to your Urban Canopy account to access community activities and your account
          features.
        </p>
      </header>

      <!-- =========================
           Login Card
      ========================== -->

      <section class="login-card" aria-labelledby="login-form-heading">
        <h2 id="login-form-heading" class="sr-only">Login form</h2>

        <form novalidate @submit.prevent="loginUser">
          <!-- Email -->

          <div class="form-group">
            <label for="login-email"> Email </label>

            <input
              id="login-email"
              v-model="formData.email"
              type="email"
              placeholder="Enter your email"
              autocomplete="email"
              required
              :aria-invalid="errors.email ? 'true' : 'false'"
              :aria-describedby="errors.email ? 'login-email-error' : undefined"
            />

            <p v-if="errors.email" id="login-email-error" class="error-message" role="alert">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password -->

          <div class="form-group">
            <label for="login-password"> Password </label>

            <input
              id="login-password"
              v-model="formData.password"
              type="password"
              placeholder="Enter your password"
              autocomplete="current-password"
              required
              :aria-invalid="errors.password ? 'true' : 'false'"
              :aria-describedby="errors.password ? 'login-password-error' : undefined"
            />

            <p v-if="errors.password" id="login-password-error" class="error-message" role="alert">
              {{ errors.password }}
            </p>
          </div>

          <!-- General Error -->

          <div v-if="generalError" class="general-error" role="alert" aria-live="assertive">
            {{ generalError }}
          </div>

          <!-- Success -->

          <div v-if="successMessage" class="success-message" role="status" aria-live="polite">
            {{ successMessage }}
          </div>

          <!-- Login Button -->

          <button
            type="submit"
            class="login-button"
            :disabled="isLoggingIn || isGoogleLoggingIn"
            :aria-busy="isLoggingIn ? 'true' : 'false'"
          >
            {{ isLoggingIn ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <!-- =========================
             Divider
        ========================== -->

        <div class="divider" aria-hidden="true">
          <span></span>

          <p>OR</p>

          <span></span>
        </div>

        <!-- =========================
             Google Login
        ========================== -->

        <button
          type="button"
          class="google-button"
          :disabled="isLoggingIn || isGoogleLoggingIn"
          :aria-busy="isGoogleLoggingIn ? 'true' : 'false'"
          aria-label="Continue login with Google"
          @click="loginWithGoogle"
        >
          <span class="google-icon" aria-hidden="true"> G </span>

          <span>
            {{ isGoogleLoggingIn ? 'Connecting to Google...' : 'Continue with Google' }}
          </span>
        </button>

        <!-- Register Link -->

        <p class="register-link">
          Don't have an account?

          <router-link to="/register"> Register here </router-link>
        </p>
      </section>
    </div>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;

  padding: 70px 20px;

  background: #f7faf5;
}

.login-container {
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

  color: #5f8956;

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

  background: #6d9c63;

  border-radius: 10px;
}

.page-header p {
  color: #4d4d4d;

  line-height: 1.7;
}

/* =========================
   Login Card
========================= */

.login-card {
  padding: 35px;

  background: white;

  border: 1px solid #dce6d9;

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

  font-weight: 700;
}

.form-group input {
  width: 100%;

  padding: 13px 14px;

  color: #222;

  background: white;

  font-family: inherit;

  font-size: 16px;

  border: 1px solid #9eaa9b;

  border-radius: 8px;

  outline: none;

  transition: 0.2s;
}

.form-group input:focus-visible {
  outline: 3px solid #2f6b3b;

  outline-offset: 2px;

  border-color: #2f6b3b;
}

/* =========================
   Messages
========================= */

.error-message {
  margin: 7px 0 0;

  color: #9c1c12;

  font-size: 14px;

  font-weight: 600;
}

.general-error {
  margin-bottom: 18px;

  padding: 12px 14px;

  color: #8f1c13;

  background: #fdecec;

  border: 1px solid #e5aaa6;

  border-radius: 8px;

  font-size: 14px;

  font-weight: 600;
}

.success-message {
  margin-bottom: 18px;

  padding: 14px;

  color: #24562f;

  background: #e7f3e8;

  border: 1px solid #b7d1b9;

  border-radius: 8px;

  font-weight: 600;
}

/* =========================
   Login Button
========================= */

.login-button {
  width: 100%;

  padding: 14px;

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

.login-button:hover:not(:disabled) {
  background: #24562f;
}

.login-button:focus-visible {
  outline: 3px solid #173f22;

  outline-offset: 3px;
}

.login-button:disabled {
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

  background: #d7ded5;
}

.divider p {
  margin: 0;

  color: #595959;

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

  color: #222;

  background: white;

  border: 1px solid #9eaa9b;

  border-radius: 8px;

  font-family: inherit;

  font-size: 16px;

  font-weight: 600;

  cursor: pointer;

  transition: 0.2s;
}

.google-button:hover:not(:disabled) {
  background: #f5f8f4;

  border-color: #70856c;
}

.google-button:focus-visible {
  outline: 3px solid #2f6b3b;

  outline-offset: 3px;
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

  color: #1a73e8;

  background: white;

  border: 1px solid #bdbdbd;

  border-radius: 50%;

  font-size: 16px;

  font-weight: 800;
}

/* =========================
   Register Link
========================= */

.register-link {
  margin-top: 22px;

  text-align: center;

  color: #4d4d4d;
}

.register-link a {
  color: #245c33;

  font-weight: 700;

  text-decoration: underline;

  text-underline-offset: 3px;
}

.register-link a:focus-visible {
  outline: 3px solid #2f6b3b;

  outline-offset: 3px;

  border-radius: 3px;
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
  .login-page {
    padding: 45px 16px;
  }

  .page-header h1 {
    font-size: 34px;
  }

  .login-card {
    padding: 25px 20px;
  }
}
</style>
