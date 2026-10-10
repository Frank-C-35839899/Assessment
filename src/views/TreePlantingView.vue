<script setup>
import { ref, computed } from 'vue'

const selectedStep = ref(null)

const stepData = {
  location: {
    number: '01',
    title: 'Choose the Location',
    intro:
      'Selecting the right location is the first step in helping a tree grow successfully and safely in an urban environment.',
    details: [
      {
        title: 'Check Available Space',
        text: 'Consider how much space is available above and below ground, including the future size of the canopy and root system.',
      },
      {
        title: 'Look at Sunlight',
        text: 'Observe how much sunlight the site receives during the day and choose a tree that suits those light conditions.',
      },
      {
        title: 'Check Nearby Structures',
        text: 'Avoid planting too close to buildings, fences, paths, underground services or overhead power lines.',
      },
      {
        title: 'Think Long Term',
        text: 'A small young tree may become much larger over time, so the planting location should allow space for future growth.',
      },
    ],
  },

  soil: {
    number: '02',
    title: 'Prepare the Soil',
    intro:
      'Good soil preparation gives the roots a better environment to establish, absorb water and access nutrients.',
    details: [
      {
        title: 'Check Drainage',
        text: 'Make sure water can drain through the soil and does not remain around the roots for long periods.',
      },
      {
        title: 'Prepare the Planting Area',
        text: 'Clear weeds, compacted material and unnecessary debris from the area before planting.',
      },
      {
        title: 'Dig an Appropriate Hole',
        text: 'The planting hole should provide enough space for the root system without forcing the roots into a small area.',
      },
      {
        title: 'Protect Soil Structure',
        text: 'Avoid heavily compacting the soil around the roots because roots need both moisture and air.',
      },
    ],
  },

  planting: {
    number: '03',
    title: 'Plant Carefully',
    intro:
      'Correct positioning is important because planting too deeply, damaging roots or placing the tree incorrectly can affect establishment.',
    details: [
      {
        title: 'Handle the Roots Carefully',
        text: 'Avoid unnecessary damage to the roots when removing the tree from its container or preparing it for planting.',
      },
      {
        title: 'Keep the Tree Upright',
        text: 'Position the tree vertically and check its alignment before replacing the surrounding soil.',
      },
      {
        title: 'Avoid Planting Too Deeply',
        text: 'The base of the trunk should not be buried deeply below the surrounding ground level.',
      },
      {
        title: 'Backfill Gently',
        text: 'Replace the soil around the roots carefully and remove large air gaps without heavily compacting the soil.',
      },
    ],
  },

  care: {
    number: '04',
    title: 'Water and Protect',
    intro:
      'The first period after planting is important. Water, protection and regular monitoring help a young tree become established.',
    details: [
      {
        title: 'Water After Planting',
        text: 'Provide water after planting so the surrounding soil is moist and the roots can begin adjusting to the new location.',
      },
      {
        title: 'Monitor Moisture',
        text: 'Check soil moisture regularly, particularly during warm or dry conditions.',
      },
      {
        title: 'Protect the Trunk',
        text: 'Avoid damage from gardening equipment, foot traffic or other activities around the base of the tree.',
      },
      {
        title: 'Check Establishment',
        text: 'Monitor the tree for signs of stress, damage, poor growth or instability during the establishment period.',
      },
    ],
  },
}

const currentStep = computed(() => {
  if (!selectedStep.value) {
    return null
  }

  return stepData[selectedStep.value]
})

const openStep = (step) => {
  selectedStep.value = step
}

const closeStep = () => {
  selectedStep.value = null
}

const treeSelection = ref({
  sunlight: '',
  space: '',
  drainage: '',
})

const treeRecommendation = ref(null)

const findTreeRecommendation = () => {
  const sunlight = treeSelection.value.sunlight
  const space = treeSelection.value.space
  const drainage = treeSelection.value.drainage

  if (!sunlight || !space || !drainage) {
    treeRecommendation.value = {
      error: true,
      title: 'Please complete all selections.',
      text: 'Choose the sunlight, available space and soil drainage before viewing a recommendation.',
    }

    return
  }

  if (space === 'small') {
    treeRecommendation.value = {
      error: false,
      title: 'Small Native Tree or Large Shrub',
      text: 'A smaller native tree or large shrub may be more suitable where growing space is limited.',
      reasons: [
        `Suitable for ${sunlight === 'full' ? 'full sun' : 'partially shaded'} conditions.`,
        'More appropriate for restricted urban spaces.',
        `Consider species suited to ${drainage} soil drainage.`,
        'Native vegetation can provide habitat and resources for local wildlife.',
      ],
    }

    return
  }

  if (space === 'medium') {
    treeRecommendation.value = {
      error: false,
      title: 'Medium-Sized Native Tree',
      text: 'A medium-sized native tree can provide shade and habitat without requiring the space of a very large canopy tree.',
      reasons: [
        `Suitable for a site with ${sunlight === 'full' ? 'good sunlight exposure' : 'some shade'}.`,
        'Provides useful canopy cover while remaining suitable for medium-sized spaces.',
        `Choose a species compatible with ${drainage} drainage conditions.`,
        'Can contribute to urban cooling and biodiversity.',
      ],
    }

    return
  }

  treeRecommendation.value = {
    error: false,
    title: 'Larger Canopy or Shade Tree',
    text: 'Where sufficient space is available, a larger tree may provide greater shade, habitat and long-term urban greening benefits.',
    reasons: [
      `Consider a species suited to ${sunlight === 'full' ? 'full sun' : 'partial shade'}.`,
      'Large sites can accommodate wider canopies and larger root systems.',
      `Check that the species is suitable for ${drainage} soil drainage.`,
      'Allow enough distance from buildings, paths and infrastructure.',
    ],
  }
}

const resetTreeSelection = () => {
  treeSelection.value = {
    sunlight: '',
    space: '',
    drainage: '',
  }

  treeRecommendation.value = null
}
</script>

<template>
  <div class="tree-page">
    <!-- =========================
         Hero
    ========================== -->
    <section class="hero-section">
      <div class="hero-content">
        <p class="page-tag">GROWING A GREENER FUTURE</p>

        <h1>Tree Planting</h1>

        <div class="title-line"></div>

        <p class="hero-text">
          Tree planting is an important part of creating greener, healthier and more resilient urban
          communities. Learn why trees matter, how to plant them correctly, and how to care for them
          after planting.
        </p>
      </div>
    </section>

    <!-- =========================
         Why Plant Trees
    ========================== -->
    <section class="importance-section">
      <div class="section-header">
        <p class="section-tag">WHY IT MATTERS</p>

        <h2>Why Plant Trees?</h2>

        <div class="section-line"></div>

        <p>
          Trees provide environmental, ecological and community benefits that can improve the
          quality of urban life.
        </p>
      </div>

      <div class="importance-grid">
        <div class="importance-card">
          <h3>Urban Cooling</h3>

          <p>
            Tree canopies provide shade and can help reduce heat exposure in streets, parks and
            other urban areas.
          </p>
        </div>

        <div class="importance-card">
          <h3>Wildlife Habitat</h3>

          <p>
            Trees can provide food, shelter and nesting spaces for birds, insects and other urban
            wildlife.
          </p>
        </div>

        <div class="importance-card">
          <h3>Healthier Communities</h3>

          <p>
            Green streets and public spaces can encourage walking, recreation, relaxation and social
            interaction.
          </p>
        </div>

        <div class="importance-card">
          <h3>Greener Neighbourhoods</h3>

          <p>
            Tree planting can make neighbourhoods more attractive while contributing to stronger
            urban green networks.
          </p>
        </div>
      </div>
    </section>

    <!-- =========================
         How to Plant a Tree
    ========================== -->
    <section class="steps-section">
      <div class="section-header">
        <p class="section-tag">PRACTICAL GUIDE</p>

        <h2>How to Plant a Tree</h2>

        <div class="section-line"></div>

        <p>
          Successful tree planting begins with good preparation and continues with appropriate care
          after planting. Select a step to learn more.
        </p>
      </div>

      <div class="steps-grid">
        <button class="step-card" @click="openStep('location')">
          <span class="step-number"> 01 </span>

          <h3>Choose the Location</h3>

          <p>
            Consider available space, sunlight, nearby structures, soil conditions and the future
            size of the tree.
          </p>

          <span class="step-link"> View Step → </span>
        </button>

        <button class="step-card" @click="openStep('soil')">
          <span class="step-number"> 02 </span>

          <h3>Prepare the Soil</h3>

          <p>
            Prepare an appropriate planting area and make sure the soil provides suitable drainage
            and space for roots.
          </p>

          <span class="step-link"> View Step → </span>
        </button>

        <button class="step-card" @click="openStep('planting')">
          <span class="step-number"> 03 </span>

          <h3>Plant Carefully</h3>

          <p>
            Position the tree carefully, keep it upright and avoid planting it too deeply before
            replacing the surrounding soil.
          </p>

          <span class="step-link"> View Step → </span>
        </button>

        <button class="step-card" @click="openStep('care')">
          <span class="step-number"> 04 </span>

          <h3>Water and Protect</h3>

          <p>
            Water the newly planted tree and provide appropriate protection while it becomes
            established.
          </p>

          <span class="step-link"> View Step → </span>
        </button>
      </div>
    </section>

    <!-- =========================
         Step Modal
    ========================== -->
    <div v-if="currentStep" class="modal-overlay" @click.self="closeStep">
      <div class="step-modal">
        <button class="close-button" @click="closeStep" aria-label="Close tree planting step">
          ×
        </button>

        <p class="modal-tag">TREE PLANTING GUIDE · STEP {{ currentStep.number }}</p>

        <h2>
          {{ currentStep.title }}
        </h2>

        <div class="modal-line"></div>

        <p class="modal-intro">
          {{ currentStep.intro }}
        </p>

        <div class="detail-grid">
          <div v-for="detail in currentStep.details" :key="detail.title" class="detail-item">
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
     Choosing the Right Tree
========================== -->
    <section class="choice-section">
      <div class="section-header">
        <p class="section-tag">PLAN BEFORE YOU PLANT</p>

        <h2>Choosing the Right Tree</h2>

        <div class="section-line"></div>

        <p>
          Every planting location is different. Use this simple guide to think about the type of
          tree that may suit your available space and growing conditions.
        </p>
      </div>

      <!-- Selection Tool -->
      <div class="tree-selector">
        <div class="selector-header">
          <h3>Tree Selection Guide</h3>

          <p>Select the conditions that best describe your planting site.</p>
        </div>

        <div class="selector-grid">
          <!-- Sunlight -->
          <div class="selector-group">
            <label for="sunlight"> Sunlight </label>

            <select id="sunlight" v-model="treeSelection.sunlight">
              <option value="">Select sunlight</option>

              <option value="full">Full Sun</option>

              <option value="partial">Partial Shade</option>
            </select>
          </div>

          <!-- Space -->
          <div class="selector-group">
            <label for="space"> Available Space </label>

            <select id="space" v-model="treeSelection.space">
              <option value="">Select space</option>

              <option value="small">Small</option>

              <option value="medium">Medium</option>

              <option value="large">Large</option>
            </select>
          </div>

          <!-- Drainage -->
          <div class="selector-group">
            <label for="drainage"> Soil Drainage </label>

            <select id="drainage" v-model="treeSelection.drainage">
              <option value="">Select drainage</option>

              <option value="good">Good</option>

              <option value="moderate">Moderate</option>
            </select>
          </div>
        </div>

        <div class="selector-actions">
          <button class="recommend-button" @click="findTreeRecommendation">
            Find a Suitable Tree Type
          </button>

          <button class="reset-button" @click="resetTreeSelection">Reset</button>
        </div>

        <!-- Result -->
        <div
          v-if="treeRecommendation"
          class="recommendation-box"
          :class="{ error: treeRecommendation.error }"
        >
          <p class="recommendation-label">
            {{ treeRecommendation.error ? 'SELECTION REQUIRED' : 'YOUR RECOMMENDATION' }}
          </p>

          <h3>
            {{ treeRecommendation.title }}
          </h3>

          <p>
            {{ treeRecommendation.text }}
          </p>

          <ul v-if="!treeRecommendation.error" class="recommendation-list">
            <li v-for="reason in treeRecommendation.reasons" :key="reason">
              {{ reason }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Supporting Information -->
      <div class="choice-grid">
        <div class="choice-card">
          <h3>Native Species</h3>

          <p>Native trees may provide valuable habitat and food resources for local wildlife.</p>
        </div>

        <div class="choice-card">
          <h3>Available Space</h3>

          <p>Consider how large the canopy and root system may become as the tree matures.</p>
        </div>

        <div class="choice-card">
          <h3>Soil and Drainage</h3>

          <p>
            Different tree species have different soil and moisture requirements, so site conditions
            should be considered.
          </p>
        </div>

        <div class="choice-card">
          <h3>Sun and Water</h3>

          <p>
            Choose a tree suited to the amount of sunlight and water available at the planting
            location.
          </p>
        </div>
      </div>
    </section>

    <!-- =========================
         Aftercare
    ========================== -->
    <section class="aftercare-section">
      <div class="aftercare-content">
        <div>
          <p class="aftercare-tag">AFTER PLANTING</p>

          <h2>Caring for a Young Tree</h2>

          <p>
            Planting is only the beginning. Young trees need ongoing care while they establish their
            root systems and adapt to their new environment.
          </p>
        </div>

        <div class="aftercare-list">
          <div class="care-item">
            <strong> Water regularly </strong>

            <span> Monitor soil moisture and provide water when needed. </span>
          </div>

          <div class="care-item">
            <strong> Protect the base </strong>

            <span> Keep the area around the young tree clear and avoid damaging the trunk. </span>
          </div>

          <div class="care-item">
            <strong> Monitor growth </strong>

            <span>
              Check the tree regularly for signs of stress, damage or poor establishment.
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- =========================
         CTA
    ========================== -->
    <section class="cta-section">
      <h2>Ready to Put It Into Practice?</h2>

      <p>Join a local tree planting activity and contribute to a greener Melbourne community.</p>

      <router-link to="/activities/tree-planting" class="cta-button">
        Explore Tree Planting Activity
      </router-link>
    </section>
  </div>
</template>

<style scoped>
.tree-page {
  width: 100%;

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

  color: #7aa66d;

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 3px;

  text-transform: uppercase;
}

.hero-section h1 {
  margin: 0;

  color: #2f6b3b;

  font-size: 56px;
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

/* =========================
   Shared Section Header
========================= */

.section-header {
  max-width: 850px;

  margin: 0 auto 45px;

  text-align: center;
}

.section-header h2 {
  margin: 0;

  color: #2f6b3b;

  font-size: 42px;
}

.section-header p {
  margin-bottom: 0;

  color: #555;

  line-height: 1.8;
}

/* =========================
   Why Plant Trees
========================= */

.importance-section {
  padding: 80px 20px;

  background: white;
}

.importance-grid {
  max-width: 1100px;

  margin: 0 auto;

  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 22px;
}

.importance-card {
  padding: 28px;

  background: #f8fbf6;

  border: 1px solid #e2e9df;
  border-left: 5px solid #7eb36a;

  border-radius: 16px;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
}

.importance-card h3 {
  margin-top: 0;

  color: #2f6b3b;
}

.importance-card p {
  margin-bottom: 0;

  color: #555;

  line-height: 1.7;
}

/* =========================
   How to Plant
========================= */

.steps-section {
  padding: 80px 20px;

  background: #eef5ee;
}

.steps-grid {
  max-width: 1100px;

  margin: 0 auto;

  display: grid;

  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: 20px;

  align-items: stretch;
}

.step-card {
  width: 100%;
  min-width: 0;

  padding: 28px 24px;

  display: flex;

  flex-direction: column;

  align-items: flex-start;

  text-align: left;

  font-family: inherit;

  background: white;

  border: none;

  border-radius: 18px;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);

  cursor: pointer;

  transition: 0.25s;
}

.step-card:hover {
  transform: translateY(-5px);

  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.09);
}

.step-number {
  display: inline-block;

  margin-bottom: 18px;

  color: #8fbe7f;

  font-size: 30px;
  font-weight: 700;
}

.step-card h3 {
  margin-top: 0;
  margin-bottom: 14px;

  color: #2f6b3b;

  font-size: 20px;
}

.step-card p {
  margin-top: 0;
  margin-bottom: 0;

  color: #555;

  line-height: 1.7;
}

.step-link {
  display: inline-block;

  margin-top: auto;

  padding-top: 18px;

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

.step-modal {
  position: relative;

  width: 100%;
  max-width: 850px;

  max-height: 85vh;

  overflow-y: auto;

  padding: 40px;

  background: white;

  border-radius: 20px;

  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.2);
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

  letter-spacing: 2px;
}

.step-modal h2 {
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

  font-size: 17px;

  line-height: 1.8;
}

.detail-grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

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

  color: #2f6b3b;
}

.detail-item p {
  margin-bottom: 0;

  color: #555;

  line-height: 1.7;
}

/* =========================
   Choosing Tree
========================= */

.choice-section {
  padding: 80px 20px;

  background: white;
}

.choice-grid {
  max-width: 1100px;

  margin: 0 auto;

  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 22px;
}

.choice-card {
  padding: 28px;

  background: #f7faf5;

  border: 1px solid #e2e9df;

  border-radius: 16px;

  transition: 0.25s;
}

.choice-card:hover {
  transform: translateY(-4px);

  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.07);
}

.choice-card h3 {
  margin-top: 0;

  color: #2f6b3b;
}

.choice-card p {
  margin-bottom: 0;

  color: #555;

  line-height: 1.7;
}
.tree-selector {
  max-width: 900px;

  margin: 0 auto 45px;

  padding: 35px;

  background: #eef5ee;

  border: 1px solid #dde8da;

  border-radius: 20px;

  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.selector-header {
  text-align: center;

  margin-bottom: 30px;
}

.selector-header h3 {
  margin-top: 0;
  margin-bottom: 8px;

  color: #2f6b3b;

  font-size: 26px;
}

.selector-header p {
  margin: 0;

  color: #555;
}

.selector-grid {
  display: grid;

  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 20px;
}

.selector-group label {
  display: block;

  margin-bottom: 8px;

  color: #263c2b;

  font-weight: 700;
}

.selector-group select {
  width: 100%;

  padding: 13px 14px;

  font-family: inherit;
  font-size: 15px;

  color: #444;

  background: white;

  border: 1px solid #cbd9c7;

  border-radius: 8px;

  outline: none;
}

.selector-group select:focus {
  border-color: #6f9f75;

  box-shadow: 0 0 0 3px rgba(111, 159, 117, 0.15);
}

.selector-actions {
  display: flex;

  justify-content: center;

  gap: 12px;

  margin-top: 28px;

  flex-wrap: wrap;
}

.recommend-button,
.reset-button {
  padding: 12px 22px;

  border: none;

  border-radius: 8px;

  font-family: inherit;

  font-size: 15px;
  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;
}

.recommend-button {
  background: #2f6b3b;

  color: white;
}

.recommend-button:hover {
  background: #25552f;

  transform: translateY(-2px);
}

.reset-button {
  background: white;

  color: #2f6b3b;

  border: 1px solid #b9cdb5;
}

.reset-button:hover {
  background: #f7faf5;
}

/* Recommendation */

.recommendation-box {
  margin-top: 30px;

  padding: 26px;

  background: white;

  border-left: 5px solid #7eb36a;

  border-radius: 14px;
}

.recommendation-box.error {
  border-left-color: #b42318;
}

.recommendation-label {
  margin: 0 0 8px;

  color: #7aa66d;

  font-size: 12px;
  font-weight: 700;

  letter-spacing: 2px;
}

.recommendation-box.error .recommendation-label {
  color: #b42318;
}

.recommendation-box h3 {
  margin-top: 0;
  margin-bottom: 10px;

  color: #2f6b3b;

  font-size: 24px;
}

.recommendation-box.error h3 {
  color: #b42318;
}

.recommendation-box p {
  color: #555;

  line-height: 1.7;
}

.recommendation-list {
  margin-bottom: 0;

  padding-left: 22px;

  color: #555;
}

.recommendation-list li {
  margin-bottom: 8px;

  line-height: 1.6;
}

/* =========================
   Aftercare
========================= */

.aftercare-section {
  padding: 80px 20px;

  background: linear-gradient(135deg, #5f956d, #8fbe88);

  color: white;
}

.aftercare-content {
  max-width: 1100px;

  margin: 0 auto;

  display: grid;

  grid-template-columns: 1fr 1.2fr;

  gap: 60px;

  align-items: center;
}

.aftercare-tag {
  margin-bottom: 10px;

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 3px;
}

.aftercare-content h2 {
  margin-top: 0;

  font-size: 40px;
}

.aftercare-content p {
  line-height: 1.8;
}

.aftercare-list {
  display: grid;

  gap: 15px;
}

.care-item {
  padding: 20px;

  background: rgba(255, 255, 255, 0.14);

  border: 1px solid rgba(255, 255, 255, 0.2);

  border-radius: 14px;
}

.care-item strong,
.care-item span {
  display: block;
}

.care-item strong {
  margin-bottom: 6px;

  font-size: 18px;
}

.care-item span {
  line-height: 1.6;
}

/* =========================
   CTA
========================= */

.cta-section {
  padding: 70px 20px;

  text-align: center;

  background: #f7faf5;
}

.cta-section h2 {
  margin-top: 0;

  color: #2f6b3b;

  font-size: 38px;
}

.cta-section p {
  margin-bottom: 28px;

  color: #555;

  font-size: 17px;
}

.cta-button {
  display: inline-block;

  padding: 13px 24px;

  background: #2f6b3b;

  color: white;

  text-decoration: none;

  font-weight: 700;

  border-radius: 8px;

  transition: 0.2s;
}

.cta-button:hover {
  background: #25552f;

  transform: translateY(-2px);
}

/* =========================
   Responsive
========================= */

@media (max-width: 1000px) {
  .steps-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .selector-grid {
    grid-template-columns: 1fr;
  }

  .tree-selector {
    padding: 26px 20px;
  }

  .hero-section {
    padding: 65px 16px;
  }

  .hero-section h1 {
    font-size: 42px;
  }

  .section-header h2 {
    font-size: 34px;
  }

  .importance-section,
  .steps-section,
  .choice-section {
    padding: 60px 16px;
  }

  .importance-grid,
  .steps-grid,
  .choice-grid {
    grid-template-columns: 1fr;
  }

  .step-modal {
    padding: 32px 20px;
  }

  .step-modal h2 {
    font-size: 30px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .aftercare-section {
    padding: 60px 20px;
  }

  .aftercare-content {
    grid-template-columns: 1fr;

    gap: 35px;
  }

  .aftercare-content h2 {
    font-size: 32px;
  }

  .cta-section h2 {
    font-size: 32px;
  }
}
</style>
