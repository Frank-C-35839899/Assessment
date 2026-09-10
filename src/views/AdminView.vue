<script setup>
import { ref, onMounted } from 'vue'

const users = ref([])
const volunteers = ref([])

const loadData = () => {
  users.value = JSON.parse(localStorage.getItem('users')) || []

  volunteers.value = JSON.parse(localStorage.getItem('volunteers')) || []
}

const deleteUser = (id) => {
  users.value = users.value.filter((user) => user.id !== id)

  localStorage.setItem('users', JSON.stringify(users.value))
}

const deleteVolunteer = (index) => {
  volunteers.value.splice(index, 1)

  localStorage.setItem('volunteers', JSON.stringify(volunteers.value))
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="admin-page">
    <div class="page-header">
      <p class="page-tag">ADMINISTRATION</p>

      <h1>Admin Dashboard</h1>

      <div class="title-line"></div>

      <p>Manage registered users and review volunteer applications.</p>
    </div>

    <!-- Users -->
    <section class="admin-section">
      <h2>Registered Users</h2>

      <div v-if="users.length === 0" class="empty-message">No registered users.</div>

      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.name }}</td>

              <td>{{ user.email }}</td>

              <td>
                <span class="role-badge" :class="user.role">
                  {{ user.role }}
                </span>
              </td>

              <td>
                <button
                  v-if="user.role !== 'admin'"
                  class="delete-button"
                  @click="deleteUser(user.id)"
                >
                  Delete
                </button>

                <span v-else class="protected-text"> Protected </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Volunteers -->
    <section class="admin-section">
      <h2>Volunteer Applications</h2>

      <div v-if="volunteers.length === 0" class="empty-message">No volunteer applications.</div>

      <div v-else class="volunteer-grid">
        <div v-for="(volunteer, index) in volunteers" :key="index" class="volunteer-card">
          <h3>{{ volunteer.name }}</h3>

          <p>
            <strong>Email:</strong>
            {{ volunteer.email }}
          </p>

          <p>
            <strong>Activity:</strong>
            {{ volunteer.activity }}
          </p>

          <p>
            <strong>Availability:</strong>
            {{ volunteer.availability }}
          </p>

          <p>
            <strong>Experience:</strong>
            {{ volunteer.experience || 'Not provided' }}
          </p>

          <p>
            <strong>Reason:</strong>
            {{ volunteer.reason || 'Not provided' }}
          </p>

          <button class="delete-button" @click="deleteVolunteer(index)">Delete Application</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.admin-page {
  min-height: 100vh;
  padding: 70px 30px;
  background: #f7faf5;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
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
  font-size: 48px;
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
}

.admin-section {
  max-width: 1200px;
  margin: 0 auto 40px;

  padding: 30px;

  background: white;

  border: 1px solid #e3e8e1;
  border-radius: 18px;

  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.admin-section h2 {
  margin-top: 0;
  margin-bottom: 25px;

  color: #2f6b3b;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 14px;

  text-align: left;

  border-bottom: 1px solid #e6e6e6;
}

th {
  background: #eef5ee;
  color: #2f4d34;
}

.role-badge {
  display: inline-block;

  padding: 5px 10px;

  border-radius: 20px;

  font-size: 13px;
  font-weight: 600;
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

.delete-button:hover {
  background: #8f1c13;
}

.protected-text {
  color: #777;
  font-size: 14px;
}

.volunteer-grid {
  display: grid;

  grid-template-columns: repeat(2, 1fr);

  gap: 20px;
}

.volunteer-card {
  padding: 22px;

  background: #f8fbf6;

  border: 1px solid #e2e9df;
  border-radius: 14px;
}

.volunteer-card h3 {
  margin-top: 0;
  color: #2f6b3b;
}

.volunteer-card p {
  line-height: 1.6;
  color: #444;
}

.empty-message {
  padding: 20px;

  text-align: center;

  color: #777;
  background: #f8faf7;

  border-radius: 8px;
}

@media (max-width: 768px) {
  .admin-page {
    padding: 45px 16px;
  }

  .page-header h1 {
    font-size: 36px;
  }

  .admin-section {
    padding: 20px;
  }

  .volunteer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
