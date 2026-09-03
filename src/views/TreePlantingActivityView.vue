<template>
  <div class="activity-page">
    <div class="activity-container">
      <!-- Title Section -->
      <div class="page-header">
        <p class="page-tag">COMMUNITY ACTIVITY</p>
        <h1>Community Tree Planting</h1>
        <div class="title-line"></div>
        <p class="page-intro">
          Community tree planting brings local residents together to improve urban green spaces,
          increase tree coverage, and support biodiversity. It also provides an opportunity for
          people to take practical action for a greener Melbourne.
        </p>
      </div>

      <!-- Top 2 cards -->
      <div class="card-grid">
        <div class="content-card">
          <h2>1. Activity Information</h2>

          <div class="info-item">
            <span class="info-label">Date</span>
            <span class="info-value">12 September 2026</span>
          </div>

          <div class="info-item">
            <span class="info-label">Location</span>
            <span class="info-value">Melbourne Community Park</span>
          </div>

          <div class="info-item">
            <span class="info-label">Activity Type</span>
            <span class="info-value">
              Community tree planting and environmental volunteering.
            </span>
          </div>
        </div>

        <div class="content-card">
          <h2>2. What You Will Do</h2>

          <div class="text-block">
            <h3>Plant Native Trees</h3>
            <p>Participants will help plant suitable native tree species within the community.</p>
          </div>

          <div class="text-block">
            <h3>Support Green Spaces</h3>
            <p>
              Volunteers will help improve local vegetation and contribute to healthier urban
              environments.
            </p>
          </div>

          <div class="text-block">
            <h3>Learn Practical Skills</h3>
            <p>Participants can learn basic planting and tree-care techniques.</p>
          </div>
        </div>
      </div>

      <!-- Bottom wide card -->
      <div class="wide-card">
        <h2>3. Why Join?</h2>

        <div class="benefit-grid">
          <div class="benefit-item">
            <h3>Support Biodiversity</h3>
            <p>Native trees can provide habitat and food for local wildlife.</p>
          </div>

          <div class="benefit-item">
            <h3>Meet the Community</h3>
            <p>
              Work together with residents and volunteers who share similar environmental interests.
            </p>
          </div>

          <div class="benefit-item">
            <h3>Make a Difference</h3>
            <p>Take direct action to improve Melbourne’s local environment.</p>
          </div>
        </div>
      </div>

      <!-- Back button -->
      <div class="button-group">
        <router-link to="/" class="back-button">← Back to Home</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.activity-page {
  background: #f7faf5;
  min-height: 100vh;
  padding: 60px 20px 80px;
}

.activity-container {
  max-width: 1300px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
}

.page-tag {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2.5px;
  color: #7aa66d;
}

.page-header h1 {
  margin: 0;
  font-size: 58px;
  color: #1f2d1f;
}

.title-line {
  width: 70px;
  height: 4px;
  background: #7eb36a;
  border-radius: 10px;
  margin: 16px auto 20px;
}

.page-intro {
  max-width: 900px;
  margin: 0 auto;
  color: #555;
  font-size: 18px;
  line-height: 1.8;
}

/* Grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
  margin-bottom: 28px;
}

.content-card,
.wide-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 34px 32px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.06);
  border: 1px solid #e7ece5;
  border-top: 6px solid #7eb36a;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.content-card:hover,
.wide-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.1);
}

.content-card h2,
.wide-card h2 {
  margin-top: 0;
  margin-bottom: 28px;
  font-size: 24px;
  color: #2f6b3b;
}

.info-item {
  padding: 18px 0;
  border-bottom: 1px solid #ececec;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  display: inline-block;
  font-size: 14px;
  font-weight: 700;
  color: #6f8b72;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.info-value {
  display: block;
  font-size: 22px;
  color: #222;
  line-height: 1.5;
}

.text-block {
  margin-bottom: 26px;
}

.text-block:last-child {
  margin-bottom: 0;
}

.text-block h3 {
  margin-bottom: 10px;
  font-size: 19px;
  color: #1f2d1f;
}

.text-block p {
  margin: 0;
  color: #555;
  line-height: 1.8;
  font-size: 17px;
}

.benefit-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.benefit-item {
  background: #f8fbf6;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e4ebe1;
}

.benefit-item h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 19px;
  color: #1f2d1f;
}

.benefit-item p {
  margin: 0;
  color: #555;
  line-height: 1.7;
  font-size: 16px;
}

.button-group {
  text-align: center;
  margin-top: 36px;
}

.back-button {
  display: inline-block;
  padding: 14px 24px;
  background: #2f6b3b;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: 0.2s ease;
}

.back-button:hover {
  background: #25552f;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 900px) {
  .card-grid,
  .benefit-grid {
    grid-template-columns: 1fr;
  }

  .page-header h1 {
    font-size: 40px;
  }

  .page-intro {
    font-size: 16px;
  }

  .info-value {
    font-size: 18px;
  }
}
</style>
