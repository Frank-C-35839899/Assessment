<script setup>
import { ref, computed } from 'vue'

import singapore1 from '../assets/Singapore1.png'
import copenhagen1 from '../assets/Copenhagen1.png'
import vancouver1 from '../assets/Vancouver1.png'
import melbourne1 from '../assets/Melbourne1.png'

const selectedBenefit = ref(null)

const benefitData = {
  cooler: {
    title: 'Cooler Cities',

    intro:
      'Trees, vegetation and green spaces can help reduce temperatures in dense urban environments and make cities more comfortable during hot weather.',

    details: [
      {
        title: 'Urban Heat Reduction',
        text: 'Built-up areas such as roads, roofs and concrete surfaces can absorb and retain heat. Increasing vegetation can help reduce this urban heat effect.',
      },

      {
        title: 'Shade and Comfort',
        text: 'Tree canopies provide shade for streets, parks and pedestrian areas, making outdoor spaces more comfortable during warmer periods.',
      },

      {
        title: 'Evapotranspiration',
        text: 'Plants release moisture into the atmosphere through evapotranspiration, which can contribute to local cooling around green spaces.',
      },

      {
        title: 'Energy Benefits',
        text: 'Shade around buildings can reduce exposure to direct sunlight and may reduce the amount of indoor cooling required during hot weather.',
      },
    ],
  },

  air: {
    title: 'Better Air Quality',

    intro:
      'Urban vegetation can contribute to healthier urban environments by interacting with airborne particles, providing shade and supporting greener streets and public spaces.',

    details: [
      {
        title: 'Airborne Particles',
        text: 'Leaves and vegetation can capture some airborne particles and reduce their movement through local urban environments.',
      },

      {
        title: 'Greener Streets',
        text: 'Trees and planted areas can help create streets that feel more pleasant and environmentally connected.',
      },

      {
        title: 'Reduced Heat Exposure',
        text: 'Shaded and vegetated areas can reduce heat exposure, helping create more comfortable environments for walking and outdoor activity.',
      },

      {
        title: 'Healthier Public Spaces',
        text: 'Well-designed green spaces can support cleaner, more comfortable and more attractive areas for communities to use.',
      },
    ],
  },

  health: {
    title: 'Healthier Communities',

    intro:
      'Access to parks, trees and green public spaces can encourage physical activity, relaxation and stronger social connections within communities.',

    details: [
      {
        title: 'Physical Activity',
        text: 'Parks, walking paths and green spaces can encourage people to walk, exercise and spend more time outdoors.',
      },

      {
        title: 'Mental Wellbeing',
        text: 'Natural environments can provide calmer spaces where people can relax, take breaks and spend time away from dense urban surroundings.',
      },

      {
        title: 'Social Connection',
        text: 'Community gardens, parks and public green spaces can create places for neighbours to meet, participate in activities and build stronger connections.',
      },

      {
        title: 'Outdoor Recreation',
        text: 'Accessible green areas give communities more opportunities for recreation, family activities and informal social interaction.',
      },
    ],
  },

  biodiversity: {
    title: 'Stronger Biodiversity',

    intro:
      'Urban green spaces can provide important habitats, food sources and movement corridors for plants, insects, birds and other wildlife.',

    details: [
      {
        title: 'Wildlife Habitat',
        text: 'Trees, shrubs and planted areas can provide shelter and nesting opportunities for different species living in urban environments.',
      },

      {
        title: 'Native Plants',
        text: 'Including native plants in urban landscapes can support local species that depend on familiar vegetation for food and habitat.',
      },

      {
        title: 'Pollinators',
        text: 'Flowering plants and gardens can provide resources for bees, butterflies and other pollinating insects.',
      },

      {
        title: 'Ecological Connections',
        text: 'Connected parks, gardens and planted corridors can help wildlife move between fragmented urban habitats.',
      },
    ],
  },
}

const currentBenefit = computed(() => {
  if (!selectedBenefit.value) {
    return null
  }

  return benefitData[selectedBenefit.value]
})

const openBenefit = (benefit) => {
  selectedBenefit.value = benefit
}

const closeBenefit = () => {
  selectedBenefit.value = null
}
</script>

<template>
  <div class="urban-page">
    <!-- =========================
         Hero
    ========================== -->
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

    <!-- =========================
         Greener Cities
    ========================== -->
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

      <div class="city-grid">
        <!-- Singapore -->
        <router-link to="/urban-greening/singapore" class="city-card">
          <img :src="singapore1" alt="Singapore urban greening" class="city-image" />

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
          <img :src="copenhagen1" alt="Copenhagen urban greening" class="city-image" />

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
          <img :src="vancouver1" alt="Vancouver urban greening" class="city-image" />

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
          <img :src="melbourne1" alt="Melbourne urban greening" class="city-image" />

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

    <!-- =========================
         Benefits
    ========================== -->
    <section class="benefits-section">
      <div class="section-header">
        <p class="section-tag">WHY IT MATTERS</p>

        <h2>Benefits of Urban Greening</h2>

        <div class="section-line"></div>

        <p>
          Greener urban environments can support healthier communities and more resilient
          ecosystems. Select a benefit to learn more.
        </p>
      </div>

      <div class="benefit-grid">
        <!-- Cooler Cities -->
        <button class="benefit-card" @click="openBenefit('cooler')">
          <h3>Cooler Cities</h3>

          <p>Vegetation and shade can help reduce heat in built-up urban areas.</p>

          <span class="learn-more"> Learn More → </span>
        </button>

        <!-- Better Air Quality -->
        <button class="benefit-card" @click="openBenefit('air')">
          <h3>Better Air Quality</h3>

          <p>Trees and plants contribute to cleaner and healthier urban environments.</p>

          <span class="learn-more"> Learn More → </span>
        </button>

        <!-- Healthier Communities -->
        <button class="benefit-card" @click="openBenefit('health')">
          <h3>Healthier Communities</h3>

          <p>
            Access to green space can encourage outdoor activity, relaxation and social connection.
          </p>

          <span class="learn-more"> Learn More → </span>
        </button>

        <!-- Stronger Biodiversity -->
        <button class="benefit-card" @click="openBenefit('biodiversity')">
          <h3>Stronger Biodiversity</h3>

          <p>
            Green spaces can provide habitat and resources for native plants, insects and wildlife.
          </p>

          <span class="learn-more"> Learn More → </span>
        </button>
      </div>
    </section>

    <!-- =========================
         Dynamic Benefit Modal
    ========================== -->
    <div v-if="currentBenefit" class="modal-overlay" @click.self="closeBenefit">
      <div class="benefit-modal">
        <button class="close-button" @click="closeBenefit" aria-label="Close benefit information">
          ×
        </button>

        <p class="modal-tag">URBAN GREENING BENEFIT</p>

        <h2>
          {{ currentBenefit.title }}
        </h2>

        <div class="modal-line"></div>

        <p class="modal-intro">
          {{ currentBenefit.intro }}
        </p>

        <div class="detail-grid">
          <div v-for="detail in currentBenefit.details" :key="detail.title" class="detail-item">
            <h3>
              {{ detail.title }}
            </h3>

            <p>
              {{ detail.text }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================
         CTA
    ========================== -->
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

/* =========================
   Hero
========================= */

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

/* =========================
   Section Header
========================= */

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

/* =========================
   City Section
========================= */

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

.city-image {
  width: 100%;

  height: 210px;

  object-fit: cover;

  display: block;
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

/* =========================
   Benefits
========================= */

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
  width: 100%;

  padding: 28px;

  text-align: left;

  font-family: inherit;

  background: white;

  border: none;

  border-left: 5px solid #7eb36a;

  border-radius: 16px;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);

  cursor: pointer;

  transition: 0.25s;
}

.benefit-card:hover {
  transform: translateY(-4px);

  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.09);
}

.benefit-card h3 {
  margin-top: 0;

  color: #2f6b3b;

  font-size: 22px;
}

.benefit-card p {
  margin-bottom: 0;

  color: #555;

  line-height: 1.7;

  font-size: 16px;
}

.learn-more {
  display: inline-block;

  margin-top: 18px;

  color: #2f6b3b;

  font-weight: 700;
}

/* =========================
   Modal
========================= */

.modal-overlay {
  position: fixed;

  inset: 0;

  z-index: 1000;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(20, 35, 24, 0.55);
}

.benefit-modal {
  position: relative;

  width: 100%;
  max-width: 850px;

  max-height: 85vh;

  overflow-y: auto;

  padding: 40px;

  background: white;

  border-radius: 20px;

  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.2);

  animation: modalIn 0.25s ease;
}

.close-button {
  position: absolute;

  top: 16px;
  right: 20px;

  width: 42px;
  height: 42px;

  border: none;

  border-radius: 50%;

  background: #eef5ee;

  color: #2f6b3b;

  font-size: 28px;

  line-height: 1;

  cursor: pointer;
}

.close-button:hover {
  background: #dfeade;
}

.modal-tag {
  margin-bottom: 8px;

  color: #7aa66d;

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 3px;
}

.benefit-modal h2 {
  margin: 0;

  color: #2f6b3b;

  font-size: 38px;
}

.modal-line {
  width: 70px;
  height: 4px;

  margin: 15px 0 20px;

  background: #8fbe7f;

  border-radius: 10px;
}

.modal-intro {
  color: #555;

  line-height: 1.8;

  font-size: 17px;
}

.detail-grid {
  display: grid;

  grid-template-columns: repeat(2, 1fr);

  gap: 18px;

  margin-top: 28px;
}

.detail-item {
  padding: 22px;

  background: #f7faf5;

  border: 1px solid #e2e9df;

  border-radius: 14px;
}

.detail-item h3 {
  margin-top: 0;
  margin-bottom: 10px;

  color: #2f6b3b;

  font-size: 19px;
}

.detail-item p {
  margin-bottom: 0;

  color: #555;

  line-height: 1.7;
}

@keyframes modalIn {
  from {
    opacity: 0;

    transform: translateY(12px) scale(0.98);
  }

  to {
    opacity: 1;

    transform: translateY(0) scale(1);
  }
}

/* =========================
   CTA
========================= */

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

/* =========================
   Responsive
========================= */

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

  .city-grid,
  .benefit-grid {
    grid-template-columns: 1fr;
  }

  .city-image {
    height: 190px;
  }

  .benefit-modal {
    padding: 32px 20px;
  }

  .benefit-modal h2 {
    font-size: 30px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .cta-section h2 {
    font-size: 32px;
  }
}
</style>
