<template>
  <section class="importance-section">
    <h2>Importance of Urban Greening</h2>

    <div class="cards">
      <router-link to="/importance/hydrology-soil" class="importance-card hydrology-card">
        <span>Hydrology and Soil</span>
      </router-link>

      <router-link to="/importance/health" class="importance-card health-card">
        <span>Physical and Mental Health</span>
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
  min-height: 200px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 30px;
  border-radius: 12px;

  text-decoration: none;
  color: white;

  font-size: 24px;
  font-weight: bold;

  background-size: cover;
  background-position: center;

  position: relative;
  overflow: hidden;

  transition: 0.2s;
}

.importance-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}

.importance-card span {
  position: relative;
  z-index: 1;
}

.hydrology-card {
  background-image: url('../assets/hydrology-soil.png');
}

.health-card {
  background-image: url('../assets/physical-mental-health.png');
}

.importance-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
}
</style>
