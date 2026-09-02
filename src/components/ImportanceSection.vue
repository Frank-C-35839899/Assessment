<template>
  <section class="importance-section">
    <h2>Importance of Urban Greening</h2>

    <div class="cards">
      <router-link to="/importance/hydrology-soil" class="importance-card">
        Hydrology and Soil
      </router-link>

      <router-link to="/importance/health" class="importance-card">
        Physical and Mental Health
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.importance-section {
  padding: 50px 40px;
}

.cards {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.importance-card {
  flex: 1;
  min-width: 280px;

  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 160px;
  padding: 30px;

  border: 1px solid #ddd;
  border-radius: 10px;

  text-decoration: none;
  color: #222;

  font-size: 22px;
  font-weight: bold;

  transition: 0.2s;
}

.importance-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}
</style>
