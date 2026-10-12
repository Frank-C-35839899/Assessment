<script setup>
import { ref } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const formData = ref({
  email: '',
  password: '',
})

const errorMessage = ref('')

const loginUser = async () => {
  errorMessage.value = ''

  if (!formData.value.email || !formData.value.password) {
    errorMessage.value = 'Please enter your email and password.'
    return
  }

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

    const currentUser = {
      id: firebaseUser.uid,
      name: userData.name || firebaseUser.displayName || 'User',
      email: firebaseUser.email,
      role: userData.role || 'user',
    }

    localStorage.setItem('currentUser', JSON.stringify(currentUser))

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

        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

        <button type="submit" class="login-button">Login</button>

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
  margin-bottom: 18px;
  color: #b42318;
  font-size: 14px;
}

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

.login-button:hover {
  background: #25552f;
}

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
