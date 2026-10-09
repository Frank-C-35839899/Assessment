<template>
  <div class="urban-page">
    <!-- Hero -->
    <section class="hero-section">
      <div class="hero-content">
        <p class="page-tag">GREEN CITIES</p>

        <h1>Urban Greening</h1>

        <div class="title-line"></div>

        <p class="hero-text">
          Urban greening brings nature into cities through trees, parks, community gardens and other
          green spaces. It helps create healthier, more sustainable and more liveable communities
          across Melbourne.
        </p>
      </div>
    </section>

    <!-- Greener Cities -->
    <section class="city-section">
      <div class="section-header">
        <p class="section-tag">GREEN CITIES</p>

        <h2>Greener Cities Around the World</h2>

        <div class="section-line"></div>

        <p>
          Explore examples of cities that have integrated green spaces, urban trees and sustainable
          design into their communities. Select a city to view related images.
        </p>
      </div>

      <!-- City Cards -->
      <div class="city-grid">
        <!-- Singapore -->
        <router-link to="/urban-greening/singapore" class="city-card">
          <div class="city-image-placeholder">Singapore</div>

          <div class="city-content">
            <h3>Singapore</h3>

            <p>
              Known for integrating greenery into buildings, public spaces and urban infrastructure.
            </p>

            <span> View Gallery → </span>
          </div>
        </router-link>

        <!-- Copenhagen -->
        <router-link to="/urban-greening/copenhagen" class="city-card">
          <div class="city-image-placeholder">Copenhagen</div>

          <div class="city-content">
            <h3>Copenhagen</h3>

            <p>
              Green public spaces and sustainable urban planning contribute to a highly liveable
              city.
            </p>

            <span> View Gallery → </span>
          </div>
        </router-link>

        <!-- Vancouver -->
        <router-link to="/urban-greening/vancouver" class="city-card">
          <div class="city-image-placeholder">Vancouver</div>

          <div class="city-content">
            <h3>Vancouver</h3>

            <p>
              Urban parks and natural landscapes are closely connected with the city's built
              environment.
            </p>

            <span> View Gallery → </span>
          </div>
        </router-link>

        <!-- Melbourne -->
        <router-link to="/urban-greening/melbourne" class="city-card">
          <div class="city-image-placeholder">Melbourne</div>

          <div class="city-content">
            <h3>Melbourne</h3>

            <p>
              Melbourne continues to expand urban forests, green spaces and community greening
              initiatives.
            </p>

            <span> View Gallery → </span>
          </div>
        </router-link>
      </div>
    </section>

    <!-- Benefits -->
    <section class="benefits-section">
      <div class="section-header">
        <p class="section-tag">WHY IT MATTERS</p>

        <h2>Benefits of Urban Greening</h2>

        <div class="section-line"></div>

        <p>
          Greener urban environments can support healthier communities and more resilient
          ecosystems.
        </p>
      </div>

      <div class="benefit-grid">
        <div class="benefit-card">
          <h3>Cooler Cities</h3>

          <p>Vegetation and shade can help reduce heat in built-up urban areas.</p>
        </div>

        <div class="benefit-card">
          <h3>Better Air Quality</h3>

          <p>Trees and plants contribute to cleaner and healthier urban environments.</p>
        </div>

        <div class="benefit-card">
          <h3>Healthier Communities</h3>

          <p>
            Access to green space can encourage outdoor activity, relaxation and social connection.
          </p>
        </div>

        <div class="benefit-card">
          <h3>Stronger Biodiversity</h3>

          <p>
            Green spaces can provide habitat and resources for native plants, insects and wildlife.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <h2>Help Make Melbourne Greener</h2>

      <p>
        Take part in local environmental activities and help strengthen Melbourne's green spaces.
      </p>

      <div class="cta-buttons">
        <router-link to="/#activities" class="primary-button"> Explore Activities </router-link>

        <router-link to="/volunteer-registration" class="secondary-button">
          Become a Volunteer
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.urban-page {
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

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 3px;

  color: #7aa66d;

  text-transform: uppercase;
}

.hero-section h1 {
  margin: 0;

  font-size: 56px;

  color: #2f6b3b;
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

  font-size: 18px;

  line-height: 1.8;

  color: #4f5f52;
}

/* Section Header */

.section-header {
  max-width: 850px;

  margin: 0 auto 45px;

  text-align: center;
}

.section-header h2 {
  margin: 0;

  font-size: 42px;

  color: #2f6b3b;
}

.section-header p {
  line-height: 1.8;

  color: #555;
}

/* City Section */

.city-section {
  padding: 80px 20px;

  background: white;
}

.city-grid {
  max-width: 1100px;

  margin: 0 auto;

  display: grid;

  grid-template-columns: repeat(2, 1fr);

  gap: 25px;
}

.city-card {
  display: block;

  padding: 0;

  overflow: hidden;

  text-align: left;

  text-decoration: none;

  background: white;

  border: 1px solid #e1e9df;

  border-radius: 18px;

  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);

  cursor: pointer;

  transition: 0.25s;
}

.city-card:hover {
  transform: translateY(-5px);

  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.city-image-placeholder {
  height: 210px;

  display: flex;

  align-items: center;
  justify-content: center;

  background: linear-gradient(135deg, #6fa37b, #9bc9a5);

  color: white;

  font-size: 28px;
  font-weight: 700;
}

.city-content {
  padding: 24px;
}

.city-content h3 {
  margin-top: 0;
  margin-bottom: 10px;

  color: #2f6b3b;

  font-size: 24px;
}

.city-content p {
  margin-bottom: 18px;

  color: #555;

  line-height: 1.7;
}

.city-content span {
  color: #2f6b3b;

  font-weight: 700;
}

/* Benefits */

.benefits-section {
  padding: 80px 20px;

  background: #eef5ee;
}

.benefit-grid {
  max-width: 1100px;

  margin: 0 auto;

  display: grid;

  grid-template-columns: repeat(2, 1fr);

  gap: 22px;
}

.benefit-card {
  padding: 28px;

  background: white;

  border-radius: 16px;

  border-left: 5px solid #7eb36a;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
}

.benefit-card h3 {
  margin-top: 0;

  color: #2f6b3b;
}

.benefit-card p {
  margin-bottom: 0;

  line-height: 1.7;

  color: #555;
}

/* CTA */

.cta-section {
  padding: 70px 20px;

  text-align: center;

  background: linear-gradient(135deg, #6fa37b, #9bc9a5);

  color: white;
}

.cta-section h2 {
  margin-top: 0;

  font-size: 38px;
}

.cta-section p {
  margin-bottom: 28px;

  font-size: 17px;
}

.cta-buttons {
  display: flex;

  justify-content: center;

  gap: 15px;

  flex-wrap: wrap;
}

.primary-button,
.secondary-button {
  display: inline-block;

  padding: 13px 24px;

  border-radius: 8px;

  text-decoration: none;

  font-weight: 700;

  transition: 0.2s;
}

.primary-button {
  background: #2f6b3b;

  color: white;
}

.secondary-button {
  background: white;

  color: #2f6b3b;
}

.primary-button:hover,
.secondary-button:hover {
  transform: translateY(-2px);
}

/* Responsive */

@media (max-width: 768px) {
  .hero-section {
    padding: 65px 16px;
  }

  .hero-section h1 {
    font-size: 42px;
  }

  .section-header h2 {
    font-size: 34px;
  }

  .city-section,
  .benefits-section {
    padding: 60px 16px;
  }

  .city-grid {
    grid-template-columns: 1fr;
  }

  .city-image-placeholder {
    height: 180px;
  }

  .benefit-grid {
    grid-template-columns: 1fr;
  }

  .cta-section h2 {
    font-size: 32px;
  }
}
</style>
