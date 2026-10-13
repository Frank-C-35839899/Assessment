<script setup>
import { ref } from 'vue'

import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

import { doc, getDoc, setDoc } from 'firebase/firestore'

import { auth, db } from '../firebase'

const formData = ref({
  email: '',
  password: '',
})

const errorMessage = ref('')

const isLoggingIn = ref(false)

const isGoogleLoggingIn = ref(false)

/* =========================
   Save Current User
========================= */

const saveCurrentUser = (firebaseUser, userData) => {
  const currentUser = {
    id: firebaseUser.uid,

    name: userData.name || firebaseUser.displayName || 'User',

    email: firebaseUser.email,

    role: userData.role || 'user',
  }

  localStorage.setItem('currentUser', JSON.stringify(currentUser))
}

/* =========================
   Email / Password Login
========================= */

const loginUser = async () => {
  errorMessage.value = ''

  if (!formData.value.email || !formData.value.password) {
    errorMessage.value = 'Please enter your email and password.'

    return
  }

  isLoggingIn.value = true

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      formData.value.email.trim(),
      formData.value.password,
    )

    const firebaseUser = userCredential.user

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))

    if (!userDoc.exists()) {
      errorMessage.value = 'User profile could not be found.'

      return
    }

    const userData = userDoc.data()

    saveCurrentUser(firebaseUser, userData)

    window.location.href = '/'
  } catch (error) {
    console.error(error)

    if (
      error.code === 'auth/invalid-credential' ||
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/wrong-password'
    ) {
      errorMessage.value = 'Invalid email or password.'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage.value = 'Please enter a valid email address.'
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage.value = 'Too many failed login attempts. Please try again later.'
    } else {
      errorMessage.value = 'Login failed. Please try again.'
    }
  } finally {
    isLoggingIn.value = false
  }
}

/* =========================
   Google Login
========================= */

const loginWithGoogle = async () => {
  errorMessage.value = ''

  isGoogleLoggingIn.value = true

  try {
    const provider = new GoogleAuthProvider()

    const result = await signInWithPopup(auth, provider)

    const firebaseUser = result.user

    const userReference = doc(db, 'users', firebaseUser.uid)

    const userSnapshot = await getDoc(userReference)

    let userData

    /* =========================
       First Google Login
       Create Firestore Profile
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

    saveCurrentUser(firebaseUser, userData)

    window.location.href = '/'
  } catch (error) {
    console.error('Google login failed:', error)

    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage.value = 'Google sign-in was cancelled.'
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage.value = 'The Google sign-in popup was blocked by your browser.'
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage.value = 'An account already exists with this email using another sign-in method.'
    } else {
      errorMessage.value = 'Google sign-in failed. Please try again.'
    }
  } finally {
    isGoogleLoggingIn.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="page-header">
        <p class="page-tag">WELCOME BACK</p>

        <h1>Login</h1>

        <div class="title-line"></div>

        <p>Sign in to access your Urban Canopy account.</p>
      </div>

      <form class="login-form" @submit.prevent="loginUser">
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
        </div>

        <!-- Password -->

        <div class="form-group">
          <label for="password"> Password </label>

          <input
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="Enter your password"
            autocomplete="current-password"
            required
          />
        </div>

        <!-- Error -->

        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

        <!-- Email Login -->

        <button type="submit" class="login-button" :disabled="isLoggingIn || isGoogleLoggingIn">
          {{ isLoggingIn ? 'Logging in...' : 'Login' }}
        </button>

        <!-- Divider -->

        <div class="divider">
          <span></span>

          <p>OR</p>

          <span></span>
        </div>

        <!-- Google Login -->

        <button
          type="button"
          class="google-button"
          :disabled="isLoggingIn || isGoogleLoggingIn"
          @click="loginWithGoogle"
        >
          <span class="google-icon"> G </span>

          <span>
            {{ isGoogleLoggingIn ? 'Signing in...' : 'Continue with Google' }}
          </span>
        </button>

        <p class="register-link">
          Don't have an account?

          <router-link to="/register"> Register here </router-link>
        </p>
      </form>
    </div>
  </div>
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
   Form
========================= */

.login-form {
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
   Error
========================= */

.error-message {
  margin-bottom: 18px;

  padding: 12px 14px;

  background: #fdecec;

  color: #b42318;

  border: 1px solid #f3c7c4;

  border-radius: 8px;

  font-size: 14px;
}

/* =========================
   Email Login Button
========================= */

.login-button {
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

.login-button:hover:not(:disabled) {
  background: #25552f;
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

  background: #dfe5dd;
}

.divider p {
  margin: 0;

  color: #888;

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
   Register Link
========================= */

.register-link {
  margin-top: 22px;

  text-align: center;

  color: #555;
}

.register-link a {
  color: #2f6b3b;

  font-weight: 600;

  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
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

  .login-form {
    padding: 25px 20px;
  }
}
</style>
