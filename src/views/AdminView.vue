<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { db, functions } from '../firebase'
import { httpsCallable } from 'firebase/functions'

/* =========================
   Data
========================= */

const users = ref([])
const volunteers = ref([])

const loadingUsers = ref(false)
const loadingVolunteers = ref(false)

const userLoadError = ref('')
const volunteerLoadError = ref('')

const dashboardStats = ref({
  totalUsers: 0,
  totalVolunteers: 0,
  totalRatings: 0,
  averageRating: 0,
})

const loadingStats = ref(false)
const statsError = ref('')

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
   Load Firestore Volunteers
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

    if (userCurrentPage.value > userTotalPages.value) {
      userCurrentPage.value = Math.max(1, userTotalPages.value)
    }
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

    if (volunteerCurrentPage.value > volunteerTotalPages.value) {
      volunteerCurrentPage.value = Math.max(1, volunteerTotalPages.value)
    }
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

  const end = start + userRowsPerPage

  return filteredUsers.value.slice(start, end)
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

    const volunteerAvailability = String(volunteer.availability || '').toLowerCase()

    const volunteerExperience = String(volunteer.experience || '').toLowerCase()

    const volunteerReason = String(volunteer.reason || '').toLowerCase()

    const matchesGlobal =
      !global ||
      volunteerName.includes(global) ||
      volunteerEmail.includes(global) ||
      volunteerActivity.includes(global) ||
      volunteerAvailability.includes(global) ||
      volunteerExperience.includes(global) ||
      volunteerReason.includes(global)

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

  const end = start + volunteerRowsPerPage

  return filteredVolunteers.value.slice(start, end)
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
   CSV Helpers
========================= */

const escapeCSV = (value) => {
  const text = String(value ?? '')

  const escaped = text.replace(/"/g, '""')

  return `"${escaped}"`
}

const downloadCSV = (rows, headers, filename) => {
  const csvRows = []

  csvRows.push(headers.map((header) => escapeCSV(header.label)).join(','))

  rows.forEach((row) => {
    const values = headers.map((header) => escapeCSV(row[header.key]))

    csvRows.push(values.join(','))
  })

  const csvContent = csvRows.join('\n')

  const blob = new Blob([csvContent], {
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
  const headers = [
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
  ]

  downloadCSV(filteredUsers.value, headers, 'urban-canopy-users.csv')
}

/* =========================
   Export Volunteers CSV
========================= */

const exportVolunteersCSV = () => {
  const headers = [
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
  ]

  downloadCSV(filteredVolunteers.value, headers, 'urban-canopy-volunteers.csv')
}

/* =========================
   Export Users PDF
========================= */

const exportUsersPDF = () => {
  const pdf = new jsPDF()

  pdf.setFontSize(18)

  pdf.text('Urban Canopy - Registered Users', 14, 20)

  pdf.setFontSize(10)

  pdf.text(`Total records: ${filteredUsers.value.length}`, 14, 28)

  const rows = filteredUsers.value.map((user) => [
    user.name || '',
    user.email || '',
    user.role || '',
  ])

  autoTable(pdf, {
    startY: 35,

    head: [['Name', 'Email', 'Role']],

    body: rows,

    styles: {
      fontSize: 9,
    },

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

  pdf.setFontSize(10)

  pdf.text(`Total records: ${filteredVolunteers.value.length}`, 14, 28)

  const rows = filteredVolunteers.value.map((volunteer) => [
    volunteer.name || '',
    volunteer.email || '',
    volunteer.activity || '',
    volunteer.availability || '',
    volunteer.experience || 'Not provided',
    volunteer.reason || 'Not provided',
  ])

  autoTable(pdf, {
    startY: 35,

    head: [['Name', 'Email', 'Activity', 'Availability', 'Experience', 'Reason']],

    body: rows,

    styles: {
      fontSize: 8,
      cellPadding: 3,
    },

    headStyles: {
      fillColor: [47, 107, 59],
    },

    columnStyles: {
      4: {
        cellWidth: 45,
      },
      5: {
        cellWidth: 55,
      },
    },
  })

  pdf.save('urban-canopy-volunteers.pdf')
}
</script>

<template>
  <div class="admin-page">
    <div class="page-header">
      <p class="page-tag">ADMINISTRATION</p>

      <h1>Admin Dashboard</h1>

      <div class="title-line"></div>

      <p>
        Manage registered users and volunteer applications using searchable, sortable, paginated and
        exportable tables.
      </p>
    </div>

    <!-- Dashboard Statistics -->
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

        <button class="export-button pdf-button" @click="exportUsersPDF">Export PDF</button>
      </div>

      <div class="table-controls">
        <div class="control-group wide-control">
          <label for="user-global-search"> Global Search </label>

          <input
            id="user-global-search"
            v-model="userGlobalSearch"
            type="text"
            placeholder="Search name, email or role..."
            @input="userCurrentPage = 1"
          />
        </div>

        <button class="reset-button" @click="resetUserFilters">Reset Filters</button>
      </div>

      <div class="filter-grid">
        <div class="control-group">
          <label for="user-name-filter"> Name </label>

          <input
            id="user-name-filter"
            v-model="userNameFilter"
            type="text"
            placeholder="Search name"
            @input="userCurrentPage = 1"
          />
        </div>

        <div class="control-group">
          <label for="user-email-filter"> Email </label>

          <input
            id="user-email-filter"
            v-model="userEmailFilter"
            type="text"
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
                <button class="sort-button" @click="sortUsers('name')">
                  Name
                  {{ getUserSortSymbol('name') }}
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

        <button class="export-button pdf-button" @click="exportVolunteersPDF">Export PDF</button>
      </div>

      <div class="table-controls">
        <div class="control-group wide-control">
          <label for="volunteer-global-search"> Global Search </label>

          <input
            id="volunteer-global-search"
            v-model="volunteerGlobalSearch"
            type="text"
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
            type="text"
            placeholder="Search name"
            @input="volunteerCurrentPage = 1"
          />
        </div>

        <div class="control-group">
          <label for="volunteer-email-filter"> Email </label>

          <input
            id="volunteer-email-filter"
            v-model="volunteerEmailFilter"
            type="text"
            placeholder="Search email"
            @input="volunteerCurrentPage = 1"
          />
        </div>

        <div class="control-group">
          <label for="volunteer-activity-filter"> Activity </label>

          <input
            id="volunteer-activity-filter"
            v-model="volunteerActivityFilter"
            type="text"
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

/* Header */

.page-header {
  max-width: 850px;
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

/* Sections */

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
  margin-bottom: 20px;
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
  white-space: nowrap;
}

/* Loading / error */

.status-message {
  margin-bottom: 20px;
  color: #555;
}

.error-status {
  margin-bottom: 20px;
  padding: 12px 14px;
  background: #fce8e6;
  color: #b42318;
  border-radius: 8px;
}

/* Export */

.export-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.export-button {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  background: #2f6b3b;
  color: white;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
}

.export-button:hover {
  background: #25552f;
}

.pdf-button {
  background: #527c59;
}

.pdf-button:hover {
  background: #416748;
}

/* Controls */

.table-controls {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.wide-control {
  min-width: 300px;
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
  font-family: inherit;
  font-size: 14px;
  background: white;
  border: 1px solid #ccd7ca;
  border-radius: 8px;
  outline: none;
}

.control-group input:focus,
.control-group select:focus {
  border-color: #6f9f75;
  box-shadow: 0 0 0 3px rgba(111, 159, 117, 0.15);
}

.reset-button {
  padding: 11px 18px;
  border: 1px solid #b9cdb5;
  border-radius: 8px;
  background: white;
  color: #2f6b3b;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
}

.reset-button:hover {
  background: #f2f7f0;
}

/* Tables */

.table-wrapper {
  width: 100%;
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

th {
  color: #2f4d34;
  font-size: 14px;
}

td {
  color: #444;
  font-size: 14px;
}

tbody tr:hover {
  background: #f8fbf6;
}

.sort-button {
  padding: 0;
  border: none;
  background: none;
  color: #2f4d34;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

/* Roles / actions */

.role-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  text-transform: capitalize;
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
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
}

.delete-button:hover {
  background: #8f1c13;
}

.protected-text {
  color: #777;
  font-size: 14px;
}

.empty-message {
  padding: 30px;
  text-align: center;
  color: #777;
}

/* Pagination */

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 22px;
  flex-wrap: wrap;
  color: #555;
  font-size: 14px;
}

.page-button {
  padding: 9px 16px;
  border: none;
  border-radius: 7px;
  background: #2f6b3b;
  color: white;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
}

.page-button:hover:not(:disabled) {
  background: #25552f;
}

.page-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.rows-note {
  margin-top: 12px;
  text-align: center;
  color: #777;
  font-size: 13px;
}

/* Responsive */

@media (max-width: 768px) {
  .admin-page {
    padding: 45px 16px;
  }

  .page-header h1 {
    font-size: 36px;
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

  .wide-control {
    min-width: 0;
  }

  .reset-button {
    width: 100%;
  }

  .export-actions {
    flex-direction: column;
  }

  .export-button {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
/* =========================
   Dashboard Statistics
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

  color: #7aa66d;

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

  font-weight: 600;
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

.stats-message {
  color: #555;
}

.stats-error {
  color: #b42318;

  background: #fce8e6;
}
</style>
