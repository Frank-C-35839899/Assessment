import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

const hashPassword = async (password) => {
  const data = new TextEncoder().encode(password)

  const hashBuffer = await crypto.subtle.digest('SHA-256', data)

  const hashArray = Array.from(new Uint8Array(hashBuffer))

  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

const initialiseAdmin = async () => {
  const users = JSON.parse(localStorage.getItem('users')) || []

  const adminEmail = 'admin@greenmelbourne.com'

  const adminExists = users.some((user) => user.email === adminEmail)

  if (!adminExists) {
    const hashedPassword = await hashPassword('Admin123')

    users.push({
      id: Date.now(),
      name: 'Green Melbourne Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    })

    localStorage.setItem('users', JSON.stringify(users))
  }
}

initialiseAdmin()

createApp(App).use(router).mount('#app')
