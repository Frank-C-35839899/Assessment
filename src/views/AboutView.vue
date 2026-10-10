<template>
  <div class="about-page">
    <!-- Hero -->
    <section class="hero-section">
      <div class="hero-content">
        <p class="page-tag">ABOUT URBAN CANOPY</p>

        <h1>Greener Communities, Better Futures</h1>

        <div class="title-line"></div>

        <p class="hero-text">
          Urban Canopy is a community-focused environmental website designed to help people learn
          about urban greening, tree planting and biodiversity while encouraging participation in
          local environmental activities.
        </p>
      </div>
    </section>

    <!-- Mission -->
    <section class="mission-section">
      <div class="section-header">
        <p class="section-tag">OUR PURPOSE</p>

        <h2>Our Mission</h2>

        <div class="section-line"></div>
      </div>

      <div class="mission-card">
        <p>
          Our mission is to make environmental information easier to understand and more accessible
          to the community. We aim to encourage people to learn about urban nature, take part in
          local activities and contribute to greener, healthier and more biodiverse neighbourhoods.
        </p>
      </div>
    </section>

    <!-- Values -->
    <section class="values-section">
      <div class="section-header">
        <p class="section-tag">OUR VALUES</p>

        <h2>What We Believe</h2>

        <div class="section-line"></div>

        <p>
          Urban Canopy promotes learning, participation and stronger connections between communities
          and the environment.
        </p>
      </div>

      <div class="values-grid">
        <div class="value-card">
          <h3>Learn</h3>

          <p>
            Clear and accessible information can help people understand environmental issues and
            make more informed decisions.
          </p>
        </div>

        <div class="value-card">
          <h3>Participate</h3>

          <p>
            Community activities give people opportunities to turn environmental awareness into
            meaningful action.
          </p>
        </div>

        <div class="value-card">
          <h3>Connect</h3>

          <p>
            Greener spaces can strengthen connections between people, neighbourhoods and the natural
            environment.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-page {
  background: #f7faf5;
}

/* Hero */

.hero-section {
  padding: 90px 20px 80px;

  text-align: center;

  background: linear-gradient(135deg, #e8f2e5, #f7faf5);
}

.hero-content {
  max-width: 850px;
  margin: 0 auto;
}

.page-tag,
.section-tag {
  margin-bottom: 10px;

  color: #7aa66d;

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 3px;

  text-transform: uppercase;
}

.hero-section h1 {
  margin: 0;

  color: #2f6b3b;

  font-size: 54px;
}

.title-line,
.section-line {
  width: 80px;
  height: 4px;

  margin: 16px auto 22px;

  background: #8fbe7f;

  border-radius: 10px;
}

.hero-text {
  max-width: 760px;

  margin: 0 auto;

  color: #4f5f52;

  font-size: 18px;

  line-height: 1.8;
}

/* Shared */

.section-header {
  max-width: 820px;

  margin: 0 auto 42px;

  text-align: center;
}

.section-header h2 {
  margin: 0;

  color: #2f6b3b;

  font-size: 42px;
}

.section-header p {
  color: #555;

  line-height: 1.8;
}

/* Mission */

.mission-section {
  padding: 80px 20px;

  background: white;
}

.mission-card {
  max-width: 900px;

  margin: 0 auto;

  padding: 35px;

  background: #f7faf5;

  border-left: 5px solid #7eb36a;

  border-radius: 18px;

  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.05);
}

.mission-card p {
  margin: 0;

  color: #4f5f52;

  font-size: 18px;

  line-height: 1.9;
}

/* Values */

.values-section {
  padding: 80px 20px;

  background: #eef5ee;
}

.values-grid {
  max-width: 1000px;

  margin: 0 auto;

  display: grid;

  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 22px;
}

.value-card {
  padding: 30px;

  text-align: center;

  background: white;

  border: 1px solid #e2e9df;

  border-radius: 16px;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
}

.value-card h3 {
  margin-top: 0;

  color: #2f6b3b;

  font-size: 23px;
}

.value-card p {
  margin-bottom: 0;

  color: #555;

  line-height: 1.7;
}

/* Responsive */

@media (max-width: 768px) {
  .hero-section {
    padding: 65px 16px;
  }

  .hero-section h1 {
    font-size: 40px;
  }

  .section-header h2 {
    font-size: 34px;
  }

  .mission-section,
  .values-section {
    padding: 60px 16px;
  }

  .values-grid {
    grid-template-columns: 1fr;
  }

  .mission-card {
    padding: 26px 22px;
  }
}
</style>
