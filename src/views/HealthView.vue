<template>
  <div class="detail-page">
    <h1>Physical and Mental Health</h1>

    <p class="intro">
      The environment has a decisive impact on both physical and mental health. Air quality, green
      spaces, noise levels, natural light, and the design of the places we live in can influence
      both our physiological functions and emotional wellbeing.
    </p>

    <div class="content-grid">
      <section class="info-card">
        <h2>1. Impacts on Physical Health</h2>

        <h3>Air Quality and the Respiratory System</h3>
        <p>
          Clean air can reduce the risk of respiratory and cardiovascular diseases, while severe air
          pollution may increase the risk of asthma, COPD, lung cancer, and heart disease.
        </p>

        <h3>Green Spaces and Physical Activity</h3>
        <p>
          Parks, walking trails, and cycling paths encourage outdoor activity, helping people
          control weight, lower blood pressure, and reduce the risk of chronic disease.
        </p>

        <h3>Noise Pollution and Cardiovascular Health</h3>
        <p>
          Long-term exposure to traffic, construction, and industrial noise can increase stress
          levels, blood pressure, and the risk of heart disease and stroke.
        </p>

        <h3>Natural Light and the Biological Clock</h3>
        <p>
          Natural light, especially morning sunlight, helps regulate the circadian rhythm and
          supports vitamin D synthesis, bone health, and immune function.
        </p>
      </section>

      <section class="info-card">
        <h2>2. Impacts on Mental Health</h2>

        <h3>Natural Environment and Stress Reduction</h3>
        <p>
          Contact with nature, including forests, rivers, and parks, can help reduce stress, support
          emotional wellbeing, and improve concentration.
        </p>

        <h3>Spatial Design and Mood</h3>
        <p>
          Crowded, damp, poorly lit, or cluttered spaces may contribute to irritability and mental
          fatigue, while bright and well-organised environments can create a greater sense of
          comfort and security.
        </p>

        <h3>Social Space and Loneliness</h3>
        <p>
          Community spaces such as parks, squares, and community centres can encourage social
          interaction and help reduce feelings of loneliness.
        </p>

        <h3>Sleep Quality and Mental State</h3>
        <p>
          Light pollution and continuous noise at night can disrupt sleep, causing fatigue,
          irritability, and reduced cognitive performance.
        </p>
      </section>
    </div>

    <section class="wide-card">
      <h2>3. How the Environment Shapes Wellbeing</h2>

      <div class="points">
        <div>
          <h3>Cleaner Air</h3>
          <p>
            Better air quality supports healthier lungs and reduces exposure to harmful pollutants.
          </p>
        </div>

        <div>
          <h3>More Green Space</h3>
          <p>
            Access to parks and natural areas encourages physical activity and supports emotional
            wellbeing.
          </p>
        </div>

        <div>
          <h3>Healthier Urban Design</h3>
          <p>
            Well-designed urban spaces can reduce noise, improve access to natural light, and create
            stronger social connections.
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
