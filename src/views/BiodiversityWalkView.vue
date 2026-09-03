<template>
  <div class="activity-page">
    <div class="activity-container">
      <div class="page-header">
        <p class="page-tag">COMMUNITY ACTIVITY</p>
        <h1>Biodiversity Walk</h1>
        <div class="title-line"></div>

        <p class="page-intro">
          The Biodiversity Walk introduces participants to local plants, wildlife, and ecological
          relationships within Melbourne's urban environment. It combines outdoor activity with
          practical environmental learning.
        </p>
      </div>

      <div class="card-grid">
        <div class="content-card">
          <h2>1. Activity Information</h2>

          <div class="info-item">
            <span class="info-label">Date</span>
            <span class="info-value">27 September 2026</span>
          </div>

          <div class="info-item">
            <span class="info-label">Location</span>
            <span class="info-value">Melbourne Nature Reserve</span>
          </div>

          <div class="info-item">
            <span class="info-label">Activity Type</span>
            <span class="info-value"> Guided biodiversity and environmental education walk. </span>
          </div>
        </div>

        <div class="content-card">
          <h2>2. What You Will Explore</h2>

          <div class="text-block">
            <h3>Native Plants</h3>
            <p>
              Learn to recognise native plants and understand how they support Melbourne's urban
              ecosystems.
            </p>
          </div>

          <div class="text-block">
            <h3>Local Wildlife</h3>
            <p>
              Observe local wildlife and discover how urban green spaces provide food, shelter, and
              habitat.
            </p>
          </div>

          <div class="text-block">
            <h3>Ecological Relationships</h3>
            <p>Explore how plants, animals, soil, and water interact within a healthy ecosystem.</p>
          </div>
        </div>
      </div>

      <div class="wide-card">
        <h2>3. What You Can Learn</h2>

        <div class="benefit-grid">
          <div class="benefit-item">
            <h3>Species Awareness</h3>
            <p>
              Develop a better understanding of native plants and animals commonly found around
              Melbourne.
            </p>
          </div>

          <div class="benefit-item">
            <h3>Food Webs</h3>
            <p>
              Learn how organisms are connected through feeding relationships and why these
              connections matter.
            </p>
          </div>

          <div class="benefit-item">
            <h3>Conservation</h3>
            <p>
              Understand why protecting habitats and biodiversity is important for resilient urban
              ecosystems.
            </p>
          </div>
        </div>
      </div>

      <div class="button-group">
        <router-link to="/" class="back-button"> ← Back to Home </router-link>
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

@media (max-width: 900px) {
  .card-grid,
  .benefit-grid {
    grid-template-columns: 1fr;
  }

  .page-header h1 {
    font-size: 40px;
  }
}
</style>
