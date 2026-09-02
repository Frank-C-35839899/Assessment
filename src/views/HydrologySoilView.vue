<template>
  <div class="detail-page">
    <h1>Hydrology and Soil</h1>

    <p class="intro">
      Hydrology and soil science are closely connected and play an important role in water
      management, ecosystems, agriculture, climate regulation, and sustainable development.
    </p>

    <div class="content-grid">
      <section class="info-card">
        <h2>1. Importance of Hydrology</h2>

        <h3>Water Resource Management</h3>
        <p>
          Hydrology helps assess groundwater and surface water resources to support drinking water,
          industry, and agricultural irrigation.
        </p>

        <h3>Natural Disaster Prevention</h3>
        <p>Rainfall and runoff forecasting can support flood warnings and drought monitoring.</p>

        <h3>Ecosystem Maintenance</h3>
        <p>
          Maintaining the hydrological balance of wetlands, rivers, and lakes helps protect
          biodiversity.
        </p>
      </section>

      <section class="info-card">
        <h2>2. Importance of Soil Science</h2>

        <h3>Food and Agricultural Security</h3>
        <p>
          Healthy soil provides physical support and nutrients for plant growth and agricultural
          production.
        </p>

        <h3>Carbon Storage and Climate Regulation</h3>
        <p>Soil stores large amounts of carbon and contributes to climate regulation.</p>

        <h3>Water Filtration</h3>
        <p>Soil can naturally filter water and help reduce pollutants.</p>
      </section>
    </div>

    <section class="wide-card">
      <h2>3. Water–Soil Interaction</h2>

      <div class="points">
        <div>
          <h3>Soil and Water Conservation</h3>
          <p>Vegetation and healthy soil can reduce surface runoff, erosion, and water loss.</p>
        </div>

        <div>
          <h3>Water Cycle</h3>
          <p>
            Soil absorbs, stores, and gradually releases water, supporting groundwater recharge.
          </p>
        </div>

        <div>
          <h3>Agricultural Irrigation</h3>
          <p>
            Understanding soil permeability and water retention can help improve water efficiency in
            agriculture.
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
  padding: 60px 30px;
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
