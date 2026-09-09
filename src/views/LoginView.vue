<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  email: '',
  password: '',
})

const errorMessage = ref('')

const hashPassword = async (password) => {
  const data = new TextEncoder().encode(password)

  const hashBuffer = await crypto.subtle.digest('SHA-256', data)

  const hashArray = Array.from(new Uint8Array(hashBuffer))

  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

const loginUser = async () => {
  errorMessage.value = ''

  const users = JSON.parse(localStorage.getItem('users')) || []

  const email = formData.value.email.trim().toLowerCase()

  const hashedPassword = await hashPassword(formData.value.password)

  const matchedUser = users.find((user) => user.email === email && user.password === hashedPassword)

  if (!matchedUser) {
    errorMessage.value = 'Invalid email or password.'
    return
  }

  const currentUser = {
    id: matchedUser.id,
    name: matchedUser.name,
    email: matchedUser.email,
  }

  localStorage.setItem('currentUser', JSON.stringify(currentUser))

  window.location.href = '/'
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="page-header">
        <p class="page-tag">WELCOME BACK</p>

        <h1>Login</h1>

        <div class="title-line"></div>

        <p>Sign in to access your Green Melbourne account.</p>
      </div>

      <form class="login-form" @submit.prevent="loginUser">
        <div class="form-group">
          <label for="email"> Email </label>

          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="Enter your email"
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
