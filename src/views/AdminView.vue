<script setup>
import { ref, computed, onMounted } from 'vue'

import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'

import { httpsCallable } from 'firebase/functions'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import { db, functions } from '../firebase'

/* =========================
   Firestore Data
========================= */

const users = ref([])

const volunteers = ref([])

const loadingUsers = ref(false)

const loadingVolunteers = ref(false)

const userLoadError = ref('')

const volunteerLoadError = ref('')

/* =========================
   Dashboard Statistics
========================= */

const dashboardStats = ref({
  totalUsers: 0,
  totalVolunteers: 0,
  totalRatings: 0,
  averageRating: 0,
})

const loadingStats = ref(false)

const statsError = ref('')

/* =========================
   Email Form
========================= */

const emailForm = ref({
  to: '',
  subject: '',
  message: '',
})

const selectedAttachment = ref(null)

const emailSending = ref(false)

const emailSuccess = ref('')

const emailError = ref('')

const emailErrorField = ref('')
/* =========================
   User Filters
========================= */

const userGlobalSearch = ref('')

const userNameFilter = ref('')

const userEmailFilter = ref('')

const userRoleFilter = ref('')

const userSortField = ref('')

const userSortDirection = ref('asc')

const userCurrentPage = ref(1)

const userRowsPerPage = 10

/* =========================
   Volunteer Filters
========================= */

const volunteerGlobalSearch = ref('')

const volunteerNameFilter = ref('')

const volunteerEmailFilter = ref('')

const volunteerActivityFilter = ref('')

const volunteerSortField = ref('')

const volunteerSortDirection = ref('asc')

const volunteerCurrentPage = ref(1)

const volunteerRowsPerPage = 10

/* =========================
   Load Firestore Users
========================= */

const loadUsers = async () => {
  loadingUsers.value = true

  userLoadError.value = ''

  try {
    const snapshot = await getDocs(collection(db, 'users'))

    users.value = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }))
  } catch (error) {
    console.error('Failed to load users:', error)

    userLoadError.value = 'Unable to load registered users.'
  } finally {
    loadingUsers.value = false
  }
}

/* =========================
   Load Volunteers
========================= */

const loadVolunteers = async () => {
  loadingVolunteers.value = true

  volunteerLoadError.value = ''

  try {
    const snapshot = await getDocs(collection(db, 'volunteers'))

    volunteers.value = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }))
  } catch (error) {
    console.error('Failed to load volunteers:', error)

    volunteerLoadError.value = 'Unable to load volunteer applications.'
  } finally {
    loadingVolunteers.value = false
  }
}

/* =========================
   Load Dashboard Stats
========================= */

const loadDashboardStats = async () => {
  loadingStats.value = true

  statsError.value = ''

  try {
    const getDashboardStats = httpsCallable(functions, 'getDashboardStats')

    const result = await getDashboardStats()

    dashboardStats.value = {
      totalUsers: result.data.totalUsers || 0,

      totalVolunteers: result.data.totalVolunteers || 0,

      totalRatings: result.data.totalRatings || 0,

      averageRating: result.data.averageRating || 0,
    }
  } catch (error) {
    console.error('Failed to load dashboard stats:', error)

    statsError.value = 'Unable to load dashboard statistics.'
  } finally {
    loadingStats.value = false
  }
}

/* =========================
   Initial Load
========================= */

onMounted(async () => {
  await Promise.all([loadUsers(), loadVolunteers(), loadDashboardStats()])
})

/* =========================
   Delete User
========================= */

const deleteUser = async (user) => {
  if (user.role === 'admin') {
    return
  }

  const confirmed = window.confirm(`Delete user "${user.name}"?`)

  if (!confirmed) {
    return
  }

  try {
    await deleteDoc(doc(db, 'users', user.id))

    users.value = users.value.filter((item) => item.id !== user.id)

    await loadDashboardStats()
  } catch (error) {
    console.error('Failed to delete user:', error)

    alert('Unable to delete user.')
  }
}

/* =========================
   Delete Volunteer
========================= */

const deleteVolunteer = async (volunteer) => {
  const confirmed = window.confirm(`Delete volunteer application from "${volunteer.name}"?`)

  if (!confirmed) {
    return
  }

  try {
    await deleteDoc(doc(db, 'volunteers', volunteer.id))

    volunteers.value = volunteers.value.filter((item) => item.id !== volunteer.id)

    await loadDashboardStats()
  } catch (error) {
    console.error('Failed to delete volunteer:', error)

    alert('Unable to delete volunteer application.')
  }
}

/* =========================
   User Filtering
========================= */

const filteredUsers = computed(() => {
  const global = userGlobalSearch.value.trim().toLowerCase()

  const name = userNameFilter.value.trim().toLowerCase()

  const email = userEmailFilter.value.trim().toLowerCase()

  const role = userRoleFilter.value.trim().toLowerCase()

  let result = users.value.filter((user) => {
    const userName = String(user.name || '').toLowerCase()

    const userEmail = String(user.email || '').toLowerCase()

    const userRole = String(user.role || '').toLowerCase()

    const matchesGlobal =
      !global ||
      userName.includes(global) ||
      userEmail.includes(global) ||
      userRole.includes(global)

    const matchesName = !name || userName.includes(name)

    const matchesEmail = !email || userEmail.includes(email)

    const matchesRole = !role || userRole === role

    return matchesGlobal && matchesName && matchesEmail && matchesRole
  })

  if (userSortField.value) {
    result = [...result].sort((a, b) => {
      const first = String(a[userSortField.value] || '').toLowerCase()

      const second = String(b[userSortField.value] || '').toLowerCase()

      if (first < second) {
        return userSortDirection.value === 'asc' ? -1 : 1
      }

      if (first > second) {
        return userSortDirection.value === 'asc' ? 1 : -1
      }

      return 0
    })
  }

  return result
})

/* =========================
   User Sorting
========================= */

const sortUsers = (field) => {
  if (userSortField.value === field) {
    userSortDirection.value = userSortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    userSortField.value = field

    userSortDirection.value = 'asc'
  }
}

const getUserSortSymbol = (field) => {
  if (userSortField.value !== field) {
    return '↕'
  }

  return userSortDirection.value === 'asc' ? '↑' : '↓'
}

/* =========================
   User Pagination
========================= */

const userTotalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredUsers.value.length / userRowsPerPage))
})

const paginatedUsers = computed(() => {
  const start = (userCurrentPage.value - 1) * userRowsPerPage

  return filteredUsers.value.slice(start, start + userRowsPerPage)
})

const previousUserPage = () => {
  if (userCurrentPage.value > 1) {
    userCurrentPage.value--
  }
}

const nextUserPage = () => {
  if (userCurrentPage.value < userTotalPages.value) {
    userCurrentPage.value++
  }
}

/* =========================
   Reset User Filters
========================= */

const resetUserFilters = () => {
  userGlobalSearch.value = ''

  userNameFilter.value = ''

  userEmailFilter.value = ''

  userRoleFilter.value = ''

  userCurrentPage.value = 1
}

/* =========================
   Volunteer Filtering
========================= */

const filteredVolunteers = computed(() => {
  const global = volunteerGlobalSearch.value.trim().toLowerCase()

  const name = volunteerNameFilter.value.trim().toLowerCase()

  const email = volunteerEmailFilter.value.trim().toLowerCase()

  const activity = volunteerActivityFilter.value.trim().toLowerCase()

  let result = volunteers.value.filter((volunteer) => {
    const volunteerName = String(volunteer.name || '').toLowerCase()

    const volunteerEmail = String(volunteer.email || '').toLowerCase()

    const volunteerActivity = String(volunteer.activity || '').toLowerCase()

    const availability = String(volunteer.availability || '').toLowerCase()

    const experience = String(volunteer.experience || '').toLowerCase()

    const reason = String(volunteer.reason || '').toLowerCase()

    const matchesGlobal =
      !global ||
      volunteerName.includes(global) ||
      volunteerEmail.includes(global) ||
      volunteerActivity.includes(global) ||
      availability.includes(global) ||
      experience.includes(global) ||
      reason.includes(global)

    const matchesName = !name || volunteerName.includes(name)

    const matchesEmail = !email || volunteerEmail.includes(email)

    const matchesActivity = !activity || volunteerActivity.includes(activity)

    return matchesGlobal && matchesName && matchesEmail && matchesActivity
  })

  if (volunteerSortField.value) {
    result = [...result].sort((a, b) => {
      const first = String(a[volunteerSortField.value] || '').toLowerCase()

      const second = String(b[volunteerSortField.value] || '').toLowerCase()

      if (first < second) {
        return volunteerSortDirection.value === 'asc' ? -1 : 1
      }

      if (first > second) {
        return volunteerSortDirection.value === 'asc' ? 1 : -1
      }

      return 0
    })
  }

  return result
})

/* =========================
   Volunteer Sorting
========================= */

const sortVolunteers = (field) => {
  if (volunteerSortField.value === field) {
    volunteerSortDirection.value = volunteerSortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    volunteerSortField.value = field

    volunteerSortDirection.value = 'asc'
  }
}

const getVolunteerSortSymbol = (field) => {
  if (volunteerSortField.value !== field) {
    return '↕'
  }

  return volunteerSortDirection.value === 'asc' ? '↑' : '↓'
}

/* =========================
   Volunteer Pagination
========================= */

const volunteerTotalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredVolunteers.value.length / volunteerRowsPerPage))
})

const paginatedVolunteers = computed(() => {
  const start = (volunteerCurrentPage.value - 1) * volunteerRowsPerPage

  return filteredVolunteers.value.slice(start, start + volunteerRowsPerPage)
})

const previousVolunteerPage = () => {
  if (volunteerCurrentPage.value > 1) {
    volunteerCurrentPage.value--
  }
}

const nextVolunteerPage = () => {
  if (volunteerCurrentPage.value < volunteerTotalPages.value) {
    volunteerCurrentPage.value++
  }
}

/* =========================
   Reset Volunteer Filters
========================= */

const resetVolunteerFilters = () => {
  volunteerGlobalSearch.value = ''

  volunteerNameFilter.value = ''

  volunteerEmailFilter.value = ''

  volunteerActivityFilter.value = ''

  volunteerCurrentPage.value = 1
}

/* =========================
   CSV Helper
========================= */

const escapeCSV = (value) => {
  const text = String(value ?? '')

  return `"${text.replace(/"/g, '""')}"`
}

const downloadCSV = (rows, headers, filename) => {
  const csvRows = []

  csvRows.push(headers.map((header) => escapeCSV(header.label)).join(','))

  rows.forEach((row) => {
    csvRows.push(headers.map((header) => escapeCSV(row[header.key])).join(','))
  })

  const blob = new Blob([csvRows.join('\n')], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')

  link.href = url

  link.download = filename

  document.body.appendChild(link)

  link.click()

  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/* =========================
   Export Users CSV
========================= */

const exportUsersCSV = () => {
  downloadCSV(
    filteredUsers.value,
    [
      {
        label: 'Name',
        key: 'name',
      },
      {
        label: 'Email',
        key: 'email',
      },
      {
        label: 'Role',
        key: 'role',
      },
    ],
    'urban-canopy-users.csv',
  )
}

/* =========================
   Export Volunteers CSV
========================= */

const exportVolunteersCSV = () => {
  downloadCSV(
    filteredVolunteers.value,
    [
      {
        label: 'Name',
        key: 'name',
      },
      {
        label: 'Email',
        key: 'email',
      },
      {
        label: 'Activity',
        key: 'activity',
      },
      {
        label: 'Availability',
        key: 'availability',
      },
      {
        label: 'Experience',
        key: 'experience',
      },
      {
        label: 'Reason',
        key: 'reason',
      },
    ],
    'urban-canopy-volunteers.csv',
  )
}

/* =========================
   Export Users PDF
========================= */

const exportUsersPDF = () => {
  const pdf = new jsPDF()

  pdf.setFontSize(18)

  pdf.text('Urban Canopy - Registered Users', 14, 20)

  const rows = filteredUsers.value.map((user) => [
    user.name || '',
    user.email || '',
    user.role || '',
  ])

  autoTable(pdf, {
    startY: 30,

    head: [['Name', 'Email', 'Role']],

    body: rows,

    headStyles: {
      fillColor: [47, 107, 59],
    },
  })

  pdf.save('urban-canopy-users.pdf')
}

/* =========================
   Export Volunteers PDF
========================= */

const exportVolunteersPDF = () => {
  const pdf = new jsPDF({
    orientation: 'landscape',
  })

  pdf.setFontSize(18)

  pdf.text('Urban Canopy - Volunteer Applications', 14, 20)

  const rows = filteredVolunteers.value.map((volunteer) => [
    volunteer.name || '',
    volunteer.email || '',
    volunteer.activity || '',
    volunteer.availability || '',
    volunteer.experience || 'Not provided',
    volunteer.reason || 'Not provided',
  ])

  autoTable(pdf, {
    startY: 30,

    head: [['Name', 'Email', 'Activity', 'Availability', 'Experience', 'Reason']],

    body: rows,

    styles: {
      fontSize: 8,
    },

    headStyles: {
      fillColor: [47, 107, 59],
    },
  })

  pdf.save('urban-canopy-volunteers.pdf')
}

/* =========================
   Attachment Selection
========================= */

const handleAttachment = (event) => {
  emailError.value = ''
  emailSuccess.value = ''
  emailErrorField.value = ''

  const file = event.target.files[0]

  if (!file) {
    selectedAttachment.value = null
    return
  }

  const maxFileSize = 5 * 1024 * 1024

  if (file.size > maxFileSize) {
    emailError.value = 'Attachment must not exceed 5 MB.'

    emailErrorField.value = 'attachment'

    event.target.value = ''

    selectedAttachment.value = null

    return
  }

  selectedAttachment.value = file
}
/* =========================
   File → Base64
========================= */

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = String(reader.result)

      const base64 = result.split(',')[1]

      resolve(base64)
    }

    reader.onerror = () => {
      reject(new Error('Unable to read attachment.'))
    }

    reader.readAsDataURL(file)
  })
}

/* =========================
   Send Email
========================= */

const sendEmail = async () => {
  emailSuccess.value = ''
  emailError.value = ''
  emailErrorField.value = ''

  const to = emailForm.value.to.trim()

  const subject = emailForm.value.subject.trim()

  const message = emailForm.value.message.trim()

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(to)) {
    emailError.value = 'Please enter a valid recipient email address.'

    emailErrorField.value = 'to'

    return
  }

  if (subject.length < 1 || subject.length > 150) {
    emailError.value = 'Subject must be between 1 and 150 characters.'

    emailErrorField.value = 'subject'

    return
  }

  if (message.length < 1 || message.length > 5000) {
    emailError.value = 'Message must be between 1 and 5000 characters.'

    emailErrorField.value = 'message'

    return
  }

  emailSending.value = true

  try {
    let attachmentData = null

    if (selectedAttachment.value) {
      const base64 = await fileToBase64(selectedAttachment.value)

      attachmentData = {
        filename: selectedAttachment.value.name,

        content: base64,

        contentType: selectedAttachment.value.type || 'application/octet-stream',
      }
    }

    const sendAdminEmail = httpsCallable(functions, 'sendAdminEmail')

    const result = await sendAdminEmail({
      to,
      subject,
      message,
      attachment: attachmentData,
    })

    if (result.data.success) {
      emailSuccess.value = 'Email sent successfully.'

      emailForm.value = {
        to: '',
        subject: '',
        message: '',
      }

      selectedAttachment.value = null

      const fileInput = document.getElementById('email-attachment')

      if (fileInput) {
        fileInput.value = ''
      }
    } else {
      emailError.value = 'Email could not be sent.'
    }
  } catch (error) {
    console.error('Email send failed:', error)

    emailErrorField.value = 'general'

    if (error.code === 'functions/unauthenticated') {
      emailError.value = 'You must be logged in.'
    } else if (error.code === 'functions/permission-denied') {
      emailError.value = 'Only administrators can send email.'
    } else {
      emailError.value = error.message || 'Unable to send email.'
    }
  } finally {
    emailSending.value = false
  }
}
</script>

<template>
  <div class="admin-page">
    <!-- =========================
         Header
    ========================== -->

    <div class="page-header">
      <p class="page-tag">ADMINISTRATION</p>

      <h1>Admin Dashboard</h1>

      <div class="title-line"></div>

      <p>
        Manage registered users and volunteer applications using searchable, sortable, paginated and
        exportable tables.
      </p>
    </div>

    <!-- =========================
         Dashboard Statistics
    ========================== -->

    <section class="stats-section">
      <div v-if="loadingStats" class="stats-message">Loading dashboard statistics...</div>

      <div v-else-if="statsError" class="stats-error">
        {{ statsError }}
      </div>

      <div v-else class="stats-grid">
        <div class="stat-card">
          <p class="stat-label">REGISTERED USERS</p>

          <div class="stat-value">
            {{ dashboardStats.totalUsers }}
          </div>

          <p class="stat-description">Firebase registered users</p>
        </div>

        <div class="stat-card">
          <p class="stat-label">VOLUNTEERS</p>

          <div class="stat-value">
            {{ dashboardStats.totalVolunteers }}
          </div>

          <p class="stat-description">Volunteer applications</p>
        </div>

        <div class="stat-card">
          <p class="stat-label">RATINGS</p>

          <div class="stat-value">
            {{ dashboardStats.totalRatings }}
          </div>

          <p class="stat-description">Community ratings</p>
        </div>

        <div class="stat-card">
          <p class="stat-label">AVERAGE RATING</p>

          <div class="stat-value">
            {{ dashboardStats.averageRating }}

            <span class="stat-small"> / 5 </span>
          </div>

          <p class="stat-description">Average community score</p>
        </div>
      </div>
    </section>

    <!-- =========================
         Send Email
    ========================== -->

    <section class="admin-section email-section" aria-labelledby="send-email-heading">
      <div class="section-title">
        <div>
          <h2 id="send-email-heading">Send Email</h2>

          <p>Send notifications and documents to Urban Canopy community members.</p>
        </div>
      </div>

      <form class="email-form" novalidate @submit.prevent="sendEmail">
        <!-- Recipient -->

        <div class="email-field">
          <label for="email-to"> Recipient Email </label>

          <input
            id="email-to"
            v-model="emailForm.to"
            type="email"
            placeholder="example@gmail.com"
            autocomplete="email"
            required
            :aria-invalid="emailErrorField === 'to' ? 'true' : 'false'"
            :aria-describedby="emailErrorField === 'to' ? 'email-form-error' : undefined"
          />
        </div>

        <!-- Subject -->

        <div class="email-field">
          <label for="email-subject"> Subject </label>

          <input
            id="email-subject"
            v-model="emailForm.subject"
            type="text"
            maxlength="150"
            placeholder="Enter email subject"
            required
            aria-describedby="subject-count"
            :aria-invalid="emailErrorField === 'subject' ? 'true' : 'false'"
          />

          <small id="subject-count" class="character-count">
            {{ emailForm.subject.length }}
            / 150 characters
          </small>
        </div>

        <!-- Message -->

        <div class="email-field">
          <label for="email-message"> Message </label>

          <textarea
            id="email-message"
            v-model="emailForm.message"
            rows="7"
            maxlength="5000"
            placeholder="Write your message..."
            required
            aria-describedby="message-count"
            :aria-invalid="emailErrorField === 'message' ? 'true' : 'false'"
          ></textarea>

          <small id="message-count" class="character-count">
            {{ emailForm.message.length }}
            / 5000 characters
          </small>
        </div>

        <!-- Attachment -->

        <div class="email-field">
          <label> Attachment </label>

          <div class="custom-file-upload">
            <label for="email-attachment" class="file-button"> Choose File </label>

            <span id="file-name-status" class="file-name" aria-live="polite">
              {{ selectedAttachment ? selectedAttachment.name : 'No file chosen' }}
            </span>

            <input
              id="email-attachment"
              class="hidden-file-input"
              type="file"
              aria-describedby="attachment-help file-name-status"
              :aria-invalid="emailErrorField === 'attachment' ? 'true' : 'false'"
              @change="handleAttachment"
            />
          </div>

          <small id="attachment-help" class="attachment-help">
            Optional. Maximum file size: 5 MB.
          </small>

          <div v-if="selectedAttachment" class="selected-file" role="status" aria-live="polite">
            Selected:
            {{ selectedAttachment.name }}

            ({{ (selectedAttachment.size / 1024 / 1024).toFixed(2) }}
            MB)
          </div>
        </div>

        <!-- Error -->

        <div
          v-if="emailError"
          id="email-form-error"
          class="email-error"
          role="alert"
          aria-live="assertive"
        >
          {{ emailError }}
        </div>

        <!-- Success -->

        <div v-if="emailSuccess" class="email-success" role="status" aria-live="polite">
          {{ emailSuccess }}
        </div>

        <!-- Send -->

        <button
          type="submit"
          class="send-email-button"
          :disabled="emailSending"
          :aria-busy="emailSending ? 'true' : 'false'"
        >
          {{ emailSending ? 'Sending...' : 'Send Email' }}
        </button>
      </form>
    </section>

    <!-- =========================
         Registered Users
    ========================== -->

    <section class="admin-section">
      <div class="section-title">
        <div>
          <h2>Registered Users</h2>

          <p>Search, sort, filter, export and manage Urban Canopy users.</p>
        </div>

        <div class="record-count">
          {{ filteredUsers.length }}
          result<span v-if="filteredUsers.length !== 1"> s </span>
        </div>
      </div>

      <p v-if="loadingUsers" class="status-message">Loading users...</p>

      <p v-if="userLoadError" class="error-status">
        {{ userLoadError }}
      </p>

      <div class="export-actions">
        <button class="export-button" @click="exportUsersCSV">Export CSV</button>

        <button class="export-button" @click="exportUsersPDF">Export PDF</button>
      </div>

      <div class="table-controls">
        <div class="control-group wide-control">
          <label for="volunteer-global-search"> Global Search </label>

          <input
            id="volunteer-global-search"
            v-model="volunteerGlobalSearch"
            type="search"
            placeholder="Search all application fields..."
            @input="volunteerCurrentPage = 1"
          />
        </div>

        <button type="button" class="reset-button" @click="resetVolunteerFilters">
          Reset Filters
        </button>
      </div>

      <div class="filter-grid">
        <div class="control-group">
          <label for="user-name-filter"> Name </label>

          <input
            id="user-name-filter"
            v-model="userNameFilter"
            type="search"
            placeholder="Search name"
            @input="userCurrentPage = 1"
          />
        </div>

        <div class="control-group">
          <label for="user-email-filter"> Email </label>

          <input
            id="user-email-filter"
            v-model="userEmailFilter"
            type="search"
            placeholder="Search email"
            @input="userCurrentPage = 1"
          />
        </div>

        <div class="control-group">
          <label for="user-role-filter"> Role </label>

          <select id="user-role-filter" v-model="userRoleFilter" @change="userCurrentPage = 1">
            <option value="">All Roles</option>

            <option value="user">User</option>

            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>
                <button
                  type="button"
                  class="sort-button"
                  :aria-label="`Sort users by name ${
                    userSortField === 'name' ? userSortDirection : ''
                  }`"
                  @click="sortUsers('name')"
                >
                  Name
                  <span aria-hidden="true">
                    {{ getUserSortSymbol('name') }}
                  </span>
                </button>
              </th>

              <th>
                <button class="sort-button" @click="sortUsers('email')">
                  Email
                  {{ getUserSortSymbol('email') }}
                </button>
              </th>

              <th>
                <button class="sort-button" @click="sortUsers('role')">
                  Role
                  {{ getUserSortSymbol('role') }}
                </button>
              </th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="user in paginatedUsers" :key="user.id">
              <td>
                {{ user.name }}
              </td>

              <td>
                {{ user.email }}
              </td>

              <td>
                <span class="role-badge" :class="user.role">
                  {{ user.role }}
                </span>
              </td>

              <td>
                <button
                  v-if="user.role !== 'admin'"
                  class="delete-button"
                  @click="deleteUser(user)"
                >
                  Delete
                </button>

                <span v-else class="protected-text"> Protected </span>
              </td>
            </tr>

            <tr v-if="!loadingUsers && paginatedUsers.length === 0">
              <td colspan="4" class="empty-message">No users found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button class="page-button" :disabled="userCurrentPage === 1" @click="previousUserPage">
          ← Previous
        </button>

        <span>
          Page
          {{ userCurrentPage }}
          of
          {{ userTotalPages }}
        </span>

        <button
          class="page-button"
          :disabled="userCurrentPage === userTotalPages"
          @click="nextUserPage"
        >
          Next →
        </button>
      </div>

      <p class="rows-note">Showing a maximum of 10 rows per page.</p>
    </section>

    <!-- =========================
         Volunteer Applications
    ========================== -->

    <section class="admin-section">
      <div class="section-title">
        <div>
          <h2>Volunteer Applications</h2>

          <p>Search, sort, export and manage volunteer applications.</p>
        </div>

        <div class="record-count">
          {{ filteredVolunteers.length }}

          result<span v-if="filteredVolunteers.length !== 1"> s </span>
        </div>
      </div>

      <p v-if="loadingVolunteers" class="status-message">Loading volunteer applications...</p>

      <p v-if="volunteerLoadError" class="error-status">
        {{ volunteerLoadError }}
      </p>

      <div class="export-actions">
        <button class="export-button" @click="exportVolunteersCSV">Export CSV</button>

        <button class="export-button" @click="exportVolunteersPDF">Export PDF</button>
      </div>

      <div class="table-controls">
        <div class="control-group">
          <label for="volunteer-global-search"> Global Search </label>

          <input
            id="volunteer-global-search"
            v-model="volunteerGlobalSearch"
            type="search"
            placeholder="Search all application fields..."
            @input="volunteerCurrentPage = 1"
          />
        </div>

        <button class="reset-button" @click="resetVolunteerFilters">Reset Filters</button>
      </div>

      <div class="filter-grid">
        <div class="control-group">
          <label for="volunteer-name-filter"> Name </label>

          <input
            id="volunteer-name-filter"
            v-model="volunteerNameFilter"
            type="search"
            placeholder="Search name"
            @input="volunteerCurrentPage = 1"
          />
        </div>

        <div class="control-group">
          <label for="volunteer-email-filter"> Email </label>

          <input
            id="volunteer-email-filter"
            v-model="volunteerEmailFilter"
            type="search"
            placeholder="Search email"
            @input="volunteerCurrentPage = 1"
          />
        </div>

        <div class="control-group">
          <label for="volunteer-activity-filter"> Activity </label>

          <input
            id="volunteer-activity-filter"
            v-model="volunteerActivityFilter"
            type="search"
            placeholder="Search activity"
            @input="volunteerCurrentPage = 1"
          />
        </div>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>
                <button class="sort-button" @click="sortVolunteers('name')">
                  Name
                  {{ getVolunteerSortSymbol('name') }}
                </button>
              </th>

              <th>
                <button class="sort-button" @click="sortVolunteers('email')">
                  Email
                  {{ getVolunteerSortSymbol('email') }}
                </button>
              </th>

              <th>
                <button class="sort-button" @click="sortVolunteers('activity')">
                  Activity
                  {{ getVolunteerSortSymbol('activity') }}
                </button>
              </th>

              <th>
                <button class="sort-button" @click="sortVolunteers('availability')">
                  Availability
                  {{ getVolunteerSortSymbol('availability') }}
                </button>
              </th>

              <th>Experience</th>

              <th>Reason</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="volunteer in paginatedVolunteers" :key="volunteer.id">
              <td>
                {{ volunteer.name }}
              </td>

              <td>
                {{ volunteer.email }}
              </td>

              <td>
                {{ volunteer.activity }}
              </td>

              <td>
                {{ volunteer.availability }}
              </td>

              <td>
                {{ volunteer.experience || 'Not provided' }}
              </td>

              <td>
                {{ volunteer.reason || 'Not provided' }}
              </td>

              <td>
                <button class="delete-button" @click="deleteVolunteer(volunteer)">Delete</button>
              </td>
            </tr>

            <tr v-if="!loadingVolunteers && paginatedVolunteers.length === 0">
              <td colspan="7" class="empty-message">No volunteer applications found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button
          class="page-button"
          :disabled="volunteerCurrentPage === 1"
          @click="previousVolunteerPage"
        >
          ← Previous
        </button>

        <span>
          Page
          {{ volunteerCurrentPage }}
          of
          {{ volunteerTotalPages }}
        </span>

        <button
          class="page-button"
          :disabled="volunteerCurrentPage === volunteerTotalPages"
          @click="nextVolunteerPage"
        >
          Next →
        </button>
      </div>

      <p class="rows-note">Showing a maximum of 10 rows per page.</p>
    </section>
  </div>
</template>

<style scoped>
.admin-page {
  min-height: 100vh;
  padding: 70px 30px;
  background: #f7faf5;
}

/* =========================
   Header
========================= */

.page-header {
  max-width: 900px;
  margin: 0 auto 50px;
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
  font-size: 48px;
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
   Statistics
========================= */

.stats-section {
  max-width: 1350px;
  margin: 0 auto 45px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.stat-card {
  padding: 26px;
  background: white;
  border: 1px solid #e3e8e1;
  border-top: 4px solid #7eb36a;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
}

.stat-label {
  margin: 0 0 10px;
  color: #4f6f49;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.8px;
}

.stat-value {
  margin-bottom: 8px;
  color: #2f6b3b;
  font-size: 38px;
  font-weight: 700;
}

.stat-small {
  font-size: 18px;
}

.stat-description {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.stats-message,
.stats-error {
  padding: 20px;
  text-align: center;
  background: white;
  border-radius: 14px;
}

.stats-error {
  color: #b42318;
  background: #fce8e6;
}

/* =========================
   Sections
========================= */

.admin-section {
  max-width: 1350px;
  margin: 0 auto 45px;
  padding: 30px;
  background: white;
  border: 1px solid #e3e8e1;
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.section-title h2 {
  margin: 0 0 6px;
  color: #2f6b3b;
}

.section-title p {
  margin: 0;
  color: #666;
}

.record-count {
  padding: 8px 14px;
  background: #eef5ee;
  color: #2f6b3b;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
}

/* =========================
   Email
========================= */

.email-form {
  max-width: 800px;
}

.email-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 22px;
}

.email-field label {
  margin-bottom: 8px;
  color: #263c2b;
  font-weight: 700;
}

.email-field input,
.email-field textarea {
  width: 100%;
  padding: 12px 14px;
  font-family: inherit;
  font-size: 15px;
  border: 1px solid #ccd7ca;
  border-radius: 8px;
  outline: none;
}

.email-field input:focus,
.email-field textarea:focus {
  border-color: #6f9f75;
  box-shadow: 0 0 0 3px rgba(111, 159, 117, 0.15);
}

.email-field textarea {
  resize: vertical;
}

.email-field small {
  margin-top: 7px;
  color: #4d4d4d;
  font-size: 12px;
  text-align: right;
}

.selected-file {
  margin-top: 10px;
  padding: 10px 12px;
  background: #eef5ee;
  color: #2f6b3b;
  border-radius: 7px;
  font-size: 14px;
}

.send-email-button {
  padding: 13px 24px;
  border: none;
  border-radius: 8px;
  background: #2f6b3b;
  color: white;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.send-email-button:hover:not(:disabled) {
  background: #25552f;
}

.send-email-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.email-success {
  margin-bottom: 18px;
  padding: 14px;
  background: #e7f3e8;
  color: #2f6b3b;
  border-radius: 8px;
}

.email-error {
  margin-bottom: 18px;
  padding: 14px;
  background: #fdecec;
  color: #b42318;
  border: 1px solid #f3c7c4;
  border-radius: 8px;
}

/* =========================
   Controls
========================= */

.export-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.export-button {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  background: #2f6b3b;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.table-controls {
  display: flex;
  align-items: end;
  gap: 20px;
  margin-bottom: 20px;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 24px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.wide-control {
  flex: 1;
}

.control-group label {
  color: #263c2b;
  font-size: 14px;
  font-weight: 700;
}

.control-group input,
.control-group select {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid #ccd7ca;
  border-radius: 8px;
}

.reset-button {
  padding: 11px 18px;
  border: 1px solid #b9cdb5;
  border-radius: 8px;
  background: white;
  color: #2f6b3b;
  font-weight: 700;
  cursor: pointer;
}

/* =========================
   Table
========================= */

.table-wrapper {
  overflow-x: auto;
  border: 1px solid #e1e7df;
  border-radius: 12px;
}

table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
}

thead {
  background: #eef5ee;
}

th,
td {
  padding: 14px;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid #e5e9e4;
}

.sort-button {
  border: none;
  background: none;
  color: #2f4d34;
  font-weight: 700;
  cursor: pointer;
}

.role-badge {
  padding: 5px 10px;
  border-radius: 20px;
  font-weight: 700;
}

.role-badge.user {
  background: #e8f3e7;
  color: #2f6b3b;
}

.role-badge.admin {
  background: #dbe8d7;
  color: #214f2d;
}

.delete-button {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  background: #b42318;
  color: white;
  cursor: pointer;
}

.protected-text {
  color: #4d4d4d;
}

.empty-message {
  padding: 30px;
  text-align: center;
  color: #4d4d4d;
}

/* =========================
   Pagination
========================= */

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 22px;
}

.page-button {
  padding: 9px 16px;
  border: none;
  border-radius: 7px;
  background: #2f6b3b;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.page-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.rows-note {
  margin-top: 12px;
  text-align: center;
  color: #4d4d4d;
  font-size: 13px;
}

.status-message {
  color: #555;
}

.error-status {
  padding: 12px;
  color: #b42318;
  background: #fdecec;
  border-radius: 8px;
}
/* =========================
   Accessibility Focus
========================= */

.email-field input:focus-visible,
.email-field textarea:focus-visible,
.hidden-file-input:focus-visible + *,
.send-email-button:focus-visible,
.export-button:focus-visible,
.reset-button:focus-visible,
.sort-button:focus-visible,
.delete-button:focus-visible,
.page-button:focus-visible,
.control-group input:focus-visible,
.control-group select:focus-visible {
  outline: 3px solid #2f6b3b;
  outline-offset: 3px;
}

.custom-file-upload:focus-within {
  outline: 3px solid #2f6b3b;
  outline-offset: 3px;
  border-radius: 8px;
}
/* =========================
   Responsive
========================= */
.email-field input:focus-visible,
.email-field textarea:focus-visible,
.hidden-file-input:focus-visible + *,
.send-email-button:focus-visible,
.export-button:focus-visible,
.reset-button:focus-visible,
.sort-button:focus-visible,
.delete-button:focus-visible,
.page-button:focus-visible,
.control-group input:focus-visible,
.control-group select:focus-visible {
  outline: 3px solid #2f6b3b;
  outline-offset: 3px;
}
@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .admin-page {
    padding: 45px 16px;
  }

  .page-header h1 {
    font-size: 36px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .admin-section {
    padding: 20px 15px;
  }

  .section-title {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }

  .table-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .export-actions {
    flex-direction: column;
  }

  .export-button,
  .reset-button,
  .send-email-button {
    width: 100%;
  }
}
.hidden-file-input {
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
.custom-file-upload {
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 12px 14px;

  border: 1px solid #ccd7ca;
  border-radius: 8px;

  background: white;
}

.file-button {
  padding: 8px 14px;

  background: #f2f4f1;

  color: #333;

  border: 1px solid #bfc8bd;
  border-radius: 6px;

  font-weight: 600;

  cursor: pointer;

  transition: 0.2s;
}

.file-button:hover {
  background: #e8ece6;
}

.file-name {
  color: #4d4d4d;
  font-size: 14px;
}

.custom-file-upload:focus-within {
  outline: 3px solid #2f6b3b;
  outline-offset: 3px;
  border-radius: 8px;
}
</style>
