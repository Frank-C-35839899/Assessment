<template>
  <section class="importance-section">
    <div class="section-header">
      <p class="section-tag">WHY IT MATTERS</p>

      <h2>Importance of Urban Greening</h2>

      <div class="section-line"></div>

      <p class="section-description">
        Discover how urban greening supports healthier environments, stronger communities, and a
        more sustainable Melbourne.
      </p>
    </div>

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
  padding: 75px 40px;
  background: #f7faf5;
}

.section-header {
  text-align: center;
  margin-bottom: 46px;
}

.section-tag {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 3px;
  color: #6f9565;
  text-transform: uppercase;
}

.section-header h2 {
  margin: 0;
  font-size: 52px;
  font-weight: 700;
  color: #2f6b3b;
  letter-spacing: -0.5px;
}

.section-line {
  width: 90px;
  height: 5px;
  margin: 16px auto 22px;
  background: #8fbe7f;
  border-radius: 999px;
}

.section-description {
  max-width: 820px;
  margin: 0 auto;
  color: #4a594c;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.8;
}

.importance-section {
  padding: 70px 40px;
  background: #f7faf5;
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
