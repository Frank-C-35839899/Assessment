<template>
  <div class="detail-page">
    <h1>Biodiversity Walk</h1>

    <p class="intro">
      The Biodiversity Walk introduces participants to local plants, wildlife, and ecological
      relationships within Melbourne's urban environment. It combines outdoor activity with
      environmental learning.
    </p>

    <div class="content-grid">
      <section class="info-card">
        <h2>1. Activity Information</h2>

        <h3>Date</h3>
        <p>27 September 2026</p>

        <h3>Location</h3>
        <p>Melbourne Nature Reserve</p>

        <h3>Activity Type</h3>
        <p>Guided biodiversity and environmental education walk.</p>
      </section>

      <section class="info-card">
        <h2>2. What You Will Explore</h2>

        <h3>Native Plants</h3>
        <p>Learn to recognise some native plants and understand their roles in local ecosystems.</p>

        <h3>Local Wildlife</h3>
        <p>Observe local wildlife and learn how urban green spaces provide habitat and food.</p>

        <h3>Ecological Relationships</h3>
        <p>Explore how plants, animals, soil, and water interact within an ecosystem.</p>
      </section>
    </div>

    <section class="wide-card">
      <h2>3. What You Can Learn</h2>

      <div class="points">
        <div>
          <h3>Species Awareness</h3>
          <p>Develop a better understanding of plants and animals found in Melbourne.</p>
        </div>

        <div>
          <h3>Food Webs</h3>
          <p>Learn how different organisms are connected through ecological food relationships.</p>
        </div>

        <div>
          <h3>Conservation</h3>
          <p>
            Understand why protecting habitats and biodiversity is important for healthy urban
            ecosystems.
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
