<template>
  <section id="activities" class="activities-section">
    <h2>Activities</h2>

    <div class="activity-list">
      <div class="activity-card">
        <h3>Community Tree Planting</h3>
        <p>Join local residents to plant native trees in Melbourne communities.</p>
      </div>

      <div class="activity-card">
        <h3>Community Garden Day</h3>
        <p>Help improve shared green spaces and community gardens.</p>
      </div>

      <div class="activity-card">
        <h3>Biodiversity Walk</h3>
        <p>Explore local plants and wildlife while learning about urban biodiversity.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.activities-section {
  padding: 40px;
}

.activity-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.activity-card {
  flex: 1;
  min-width: 220px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
}
</style>
