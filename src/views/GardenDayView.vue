<template>
  <div class="detail-page">
    <h1>Community Garden Day</h1>

    <p class="intro">
      Community Garden Day gives residents the opportunity to work together to maintain shared green
      spaces, improve local gardens, and strengthen community connections through practical
      environmental activities.
    </p>

    <div class="content-grid">
      <section class="info-card">
        <h2>1. Activity Information</h2>

        <h3>Date</h3>
        <p>20 September 2026</p>

        <h3>Location</h3>
        <p>Local Community Garden</p>

        <h3>Activity Type</h3>
        <p>Community gardening and green-space maintenance.</p>
      </section>

      <section class="info-card">
        <h2>2. What You Will Do</h2>

        <h3>Garden Maintenance</h3>
        <p>Help maintain plants, garden beds, and shared community spaces.</p>

        <h3>Planting Activities</h3>
        <p>Take part in planting suitable flowers, herbs, and native plants.</p>

        <h3>Community Collaboration</h3>
        <p>Work alongside other residents to improve the local environment.</p>
      </section>
    </div>

    <section class="wide-card">
      <h2>3. Benefits of Community Gardening</h2>

      <div class="points">
        <div>
          <h3>Greener Neighbourhoods</h3>
          <p>
            Community gardens can improve the appearance and environmental quality of urban areas.
          </p>
        </div>

        <div>
          <h3>Social Connection</h3>
          <p>
            Shared gardening activities provide opportunities for residents to meet and work
            together.
          </p>
        </div>

        <div>
          <h3>Environmental Learning</h3>
          <p>
            Participants can develop practical knowledge about planting, gardening, and
            sustainability.
          </p>
        </div>
      </div>
    </section>

    <router-link to="/" class="back-button"> ← Back to Home </router-link>
  </div>
</template>

<style scoped>
.detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 30px 60px;
}

.detail-page h1 {
  font-size: 42px;
  margin-bottom: 20px;
}

.intro {
  font-size: 19px;
  line-height: 1.7;
  max-width: 900px;
  margin-bottom: 40px;
  color: #444;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.info-card,
.wide-card {
  padding: 28px;
  border: 1px solid #ddd;
  border-radius: 14px;
  background: #f8faf7;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.info-card h2,
.wide-card h2 {
  margin-top: 0;
  color: #2f6b3b;
}

.info-card h3,
.wide-card h3 {
  margin-top: 24px;
  margin-bottom: 8px;
}

.info-card p,
.wide-card p {
  line-height: 1.7;
  color: #444;
}

.points {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.back-button {
  display: inline-block;
  margin-top: 32px;
  padding: 12px 20px;
  background: #2f6b3b;
  color: white;
  text-decoration: none;
  border-radius: 6px;
}

.back-button:hover {
  opacity: 0.85;
}

@media (max-width: 768px) {
  .content-grid,
  .points {
    grid-template-columns: 1fr;
  }
}
</style>
