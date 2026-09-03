<template>
  <div class="detail-page">
    <h1>Community Tree Planting</h1>

    <p class="intro">
      Community tree planting brings local residents together to improve urban green spaces,
      increase tree coverage, and support biodiversity. It also provides an opportunity for people
      to take practical action for a greener Melbourne.
    </p>

    <div class="content-grid">
      <section class="info-card">
        <h2>1. Activity Information</h2>

        <h3>Date</h3>
        <p>12 September 2026</p>

        <h3>Location</h3>
        <p>Melbourne Community Park</p>

        <h3>Activity Type</h3>
        <p>Community tree planting and environmental volunteering.</p>
      </section>

      <section class="info-card">
        <h2>2. What You Will Do</h2>

        <h3>Plant Native Trees</h3>
        <p>Participants will help plant suitable native tree species within the community.</p>

        <h3>Support Green Spaces</h3>
        <p>
          Volunteers will help improve local vegetation and contribute to healthier urban
          environments.
        </p>

        <h3>Learn Practical Skills</h3>
        <p>Participants can learn basic planting and tree-care techniques.</p>
      </section>
    </div>

    <section class="wide-card">
      <h2>3. Why Join?</h2>

      <div class="points">
        <div>
          <h3>Support Biodiversity</h3>
          <p>Native trees can provide habitat and food for local wildlife.</p>
        </div>

        <div>
          <h3>Meet the Community</h3>
          <p>
            Work together with residents and volunteers who share similar environmental interests.
          </p>
        </div>

        <div>
          <h3>Make a Difference</h3>
          <p>Take direct action to improve Melbourne's local environment.</p>
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
