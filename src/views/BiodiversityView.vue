<script setup>
import { ref, computed } from 'vue'

const selectedSpecies = ref(null)

const selectedFoodLevel = ref('producer')

/* =========================
   Urban Species Data
========================= */

const speciesData = {
  birds: {
    title: 'Urban Birds',

    intro:
      'Birds are an important part of urban biodiversity and can use trees, parks and gardens for food, shelter and nesting.',

    details: [
      {
        title: 'Food Sources',
        text: 'Urban birds may rely on seeds, fruit, nectar and insects found in parks, gardens and planted areas.',
      },

      {
        title: 'Shelter',
        text: 'Trees and dense vegetation can provide places for birds to rest, hide and build nests.',
      },

      {
        title: 'Ecological Role',
        text: 'Birds can contribute to seed dispersal, insect control and broader ecological relationships.',
      },

      {
        title: 'Urban Habitat',
        text: 'Connected green spaces can help birds move between feeding, nesting and resting areas.',
      },
    ],
  },

  pollinators: {
    title: 'Pollinators',

    intro:
      'Pollinators such as bees and butterflies help flowering plants reproduce and are important for healthy ecosystems.',

    details: [
      {
        title: 'Pollination',
        text: 'Pollinators transfer pollen between flowers, helping many plants produce seeds and fruit.',
      },

      {
        title: 'Flowering Plants',
        text: 'A variety of flowering plants can provide nectar and pollen across different seasons.',
      },

      {
        title: 'Habitat',
        text: 'Gardens, native vegetation and small green spaces can provide important resources for pollinating insects.',
      },

      {
        title: 'Biodiversity Support',
        text: 'Healthy pollinator populations support wider plant diversity and the species that depend on those plants.',
      },
    ],
  },

  plants: {
    title: 'Native Plants',

    intro:
      'Native plants can support local biodiversity by providing food and habitat that are suited to local species.',

    details: [
      {
        title: 'Local Adaptation',
        text: 'Native plants are adapted to local environmental conditions and can play important roles in local ecosystems.',
      },

      {
        title: 'Food and Shelter',
        text: 'Different plant species can provide nectar, fruit, seeds and shelter for insects, birds and other wildlife.',
      },

      {
        title: 'Habitat Structure',
        text: 'Trees, shrubs, grasses and groundcover create different layers of habitat for different species.',
      },

      {
        title: 'Ecological Connections',
        text: 'Native vegetation can strengthen ecological relationships between plants, insects and animals.',
      },
    ],
  },

  insects: {
    title: 'Urban Insects',

    intro:
      'Insects are a major part of biodiversity and contribute to pollination, decomposition and food webs.',

    details: [
      {
        title: 'Pollination',
        text: 'Many insects help flowering plants reproduce by moving pollen between flowers.',
      },

      {
        title: 'Decomposition',
        text: 'Some insects help break down dead organic material and return nutrients to the environment.',
      },

      {
        title: 'Food Webs',
        text: 'Insects are an important food source for many birds and other animals.',
      },

      {
        title: 'Habitat Needs',
        text: 'Leaf litter, native vegetation and undisturbed spaces can provide shelter and resources for insects.',
      },
    ],
  },
}

const currentSpecies = computed(() => {
  if (!selectedSpecies.value) {
    return null
  }

  return speciesData[selectedSpecies.value]
})

const openSpecies = (species) => {
  selectedSpecies.value = species
}

const closeSpecies = () => {
  selectedSpecies.value = null
}

/* =========================
   Food Chain Data
========================= */

const foodChainData = {
  producer: {
    title: 'Native Plants',
    role: 'Producer',

    description:
      'Plants capture energy from sunlight and form the base of many food chains. They provide leaves, nectar, seeds and other resources for animals.',
  },

  primary: {
    title: 'Insects',
    role: 'Primary Consumer',

    description:
      'Many insects feed directly on plants, nectar or other plant material. They transfer energy from producers to higher levels of the food chain.',
  },

  secondary: {
    title: 'Small Birds',
    role: 'Secondary Consumer',

    description:
      'Many small birds eat insects and other invertebrates, helping transfer energy to higher trophic levels.',
  },

  tertiary: {
    title: 'Birds of Prey',
    role: 'Higher-Level Consumer',

    description:
      'Predatory birds may feed on smaller birds and other animals, placing them higher in the urban food chain.',
  },
}

const currentFoodLevel = computed(() => {
  return foodChainData[selectedFoodLevel.value]
})
</script>

<template>
  <div class="biodiversity-page">
    <!-- =========================
         Hero
    ========================== -->
    <section class="hero-section">
      <div class="hero-content">
        <p class="page-tag">NATURE IN OUR CITIES</p>

        <h1>Biodiversity</h1>

        <div class="title-line"></div>

        <p class="hero-text">
          Biodiversity is the variety of living organisms and the relationships between them. In
          urban environments, plants, animals, insects and habitats all contribute to healthier and
          more resilient ecosystems.
        </p>
      </div>
    </section>

    <!-- =========================
         Why Biodiversity Matters
    ========================== -->
    <section class="importance-section">
      <div class="section-header">
        <p class="section-tag">WHY IT MATTERS</p>

        <h2>Why Biodiversity Matters</h2>

        <div class="section-line"></div>

        <p>
          Diverse ecosystems can support wildlife, ecological processes and healthier urban
          environments.
        </p>
      </div>

      <div class="importance-grid">
        <div class="importance-card">
          <h3>Healthy Ecosystems</h3>

          <p>
            Biodiversity supports ecological processes and helps ecosystems respond to changing
            environmental conditions.
          </p>
        </div>

        <div class="importance-card">
          <h3>Wildlife Habitat</h3>

          <p>
            Diverse vegetation can provide food, shelter and breeding spaces for many different
            urban species.
          </p>
        </div>

        <div class="importance-card">
          <h3>Pollination</h3>

          <p>
            Pollinating insects help flowering plants reproduce and support broader ecological
            relationships.
          </p>
        </div>

        <div class="importance-card">
          <h3>Stronger Communities</h3>

          <p>
            Biodiverse green spaces can create attractive places for recreation, learning and
            connection with nature.
          </p>
        </div>
      </div>
    </section>

    <!-- =========================
         Food Chain
    ========================== -->
    <section class="food-chain-section">
      <div class="section-header">
        <p class="section-tag">HOW BIODIVERSITY CONNECTS</p>

        <h2>A Simple Urban Food Chain</h2>

        <div class="section-line"></div>

        <p>
          Energy moves through ecosystems as organisms feed on plants and other animals. Select each
          level to explore its role in this simple urban food chain.
        </p>
      </div>

      <div class="food-chain-container">
        <div class="food-chain">
          <!-- Producer -->
          <button
            class="food-level"
            :class="{ active: selectedFoodLevel === 'producer' }"
            @click="selectedFoodLevel = 'producer'"
          >
            <span class="food-icon"> 🌿 </span>

            <strong> Native Plants </strong>

            <small> Producer </small>
          </button>

          <div class="chain-arrow">→</div>

          <!-- Primary Consumer -->
          <button
            class="food-level"
            :class="{ active: selectedFoodLevel === 'primary' }"
            @click="selectedFoodLevel = 'primary'"
          >
            <span class="food-icon"> 🐛 </span>

            <strong> Insects </strong>

            <small> Primary Consumer </small>
          </button>

          <div class="chain-arrow">→</div>

          <!-- Secondary Consumer -->
          <button
            class="food-level"
            :class="{ active: selectedFoodLevel === 'secondary' }"
            @click="selectedFoodLevel = 'secondary'"
          >
            <span class="food-icon"> 🐦 </span>

            <strong> Small Birds </strong>

            <small> Secondary Consumer </small>
          </button>

          <div class="chain-arrow">→</div>

          <!-- Higher Consumer -->
          <button
            class="food-level"
            :class="{ active: selectedFoodLevel === 'tertiary' }"
            @click="selectedFoodLevel = 'tertiary'"
          >
            <span class="food-icon"> 🦅 </span>

            <strong> Birds of Prey </strong>

            <small> Higher Consumer </small>
          </button>
        </div>

        <!-- Dynamic Food Chain Explanation -->
        <div class="food-detail">
          <p class="food-role">
            {{ currentFoodLevel.role }}
          </p>

          <h3>
            {{ currentFoodLevel.title }}
          </h3>

          <p>
            {{ currentFoodLevel.description }}
          </p>
        </div>

        <p class="food-chain-note">
          The arrows show the direction of energy transfer: from the organism being eaten to the
          organism that consumes it.
        </p>
      </div>
    </section>

    <!-- =========================
         Urban Species
    ========================== -->
    <section class="species-section">
      <div class="section-header">
        <p class="section-tag">DISCOVER URBAN NATURE</p>

        <h2>Urban Species</h2>

        <div class="section-line"></div>

        <p>
          Cities can support many different forms of life. Select a group to learn more about its
          role in urban biodiversity.
        </p>
      </div>

      <div class="species-grid">
        <!-- Birds -->
        <button class="species-card" @click="openSpecies('birds')">
          <span class="species-icon"> 🐦 </span>

          <h3>Urban Birds</h3>

          <p>Birds use trees, gardens and green spaces for food, shelter and nesting.</p>

          <span class="learn-more"> Learn More → </span>
        </button>

        <!-- Pollinators -->
        <button class="species-card" @click="openSpecies('pollinators')">
          <span class="species-icon"> 🐝 </span>

          <h3>Pollinators</h3>

          <p>
            Bees, butterflies and other pollinators support flowering plants and ecosystem health.
          </p>

          <span class="learn-more"> Learn More → </span>
        </button>

        <!-- Plants -->
        <button class="species-card" @click="openSpecies('plants')">
          <span class="species-icon"> 🌿 </span>

          <h3>Native Plants</h3>

          <p>Native vegetation can provide important food and habitat for local wildlife.</p>

          <span class="learn-more"> Learn More → </span>
        </button>

        <!-- Insects -->
        <button class="species-card" @click="openSpecies('insects')">
          <span class="species-icon"> 🦋 </span>

          <h3>Urban Insects</h3>

          <p>Insects contribute to pollination, decomposition and urban food webs.</p>

          <span class="learn-more"> Learn More → </span>
        </button>
      </div>
    </section>

    <!-- =========================
         Species Modal
    ========================== -->
    <div v-if="currentSpecies" class="modal-overlay" @click.self="closeSpecies">
      <div class="species-modal">
        <button
          class="close-button"
          @click="closeSpecies"
          aria-label="Close biodiversity information"
        >
          ×
        </button>

        <p class="modal-tag">URBAN BIODIVERSITY</p>

        <h2>
          {{ currentSpecies.title }}
        </h2>

        <div class="modal-line"></div>

        <p class="modal-intro">
          {{ currentSpecies.intro }}
        </p>

        <div class="detail-grid">
          <div v-for="detail in currentSpecies.details" :key="detail.title" class="detail-item">
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
         Ecological Relationships
    ========================== -->
    <section class="relationships-section">
      <div class="section-header">
        <p class="section-tag">CONNECTED ECOSYSTEMS</p>

        <h2>Ecological Relationships</h2>

        <div class="section-line"></div>

        <p>
          Biodiversity is not only about individual species. Healthy ecosystems depend on
          connections between organisms and their environment.
        </p>
      </div>

      <div class="relationship-grid">
        <div class="relationship-card">
          <span class="relationship-number"> 01 </span>

          <h3>Pollination</h3>

          <p>
            Pollinating insects visit flowers for nectar and pollen, helping many plants reproduce.
          </p>
        </div>

        <div class="relationship-card">
          <span class="relationship-number"> 02 </span>

          <h3>Food Webs</h3>

          <p>
            Plants, insects, birds and other organisms depend on one another as part of
            interconnected food relationships.
          </p>
        </div>

        <div class="relationship-card">
          <span class="relationship-number"> 03 </span>

          <h3>Habitat</h3>

          <p>
            Vegetation provides different layers of shelter, nesting spaces and resources for urban
            wildlife.
          </p>
        </div>
      </div>
    </section>

    <!-- =========================
         Threats
    ========================== -->
    <section class="threats-section">
      <div class="section-header">
        <p class="section-tag">CHALLENGES</p>

        <h2>Threats to Urban Biodiversity</h2>

        <div class="section-line"></div>

        <p>
          Urban biodiversity can be affected when habitats become smaller, fragmented or less
          suitable for local species.
        </p>
      </div>

      <div class="threat-grid">
        <div class="threat-card">
          <h3>Habitat Loss</h3>

          <p>
            Removing vegetation can reduce the food, shelter and breeding spaces available to
            wildlife.
          </p>
        </div>

        <div class="threat-card">
          <h3>Habitat Fragmentation</h3>

          <p>
            Isolated green spaces can make it more difficult for species to move safely through
            urban environments.
          </p>
        </div>

        <div class="threat-card">
          <h3>Invasive Species</h3>

          <p>
            Some introduced species can compete with native plants and animals for space and
            resources.
          </p>
        </div>

        <div class="threat-card">
          <h3>Pollution</h3>

          <p>
            Air, water, light and other forms of pollution can affect habitats and the species that
            depend on them.
          </p>
        </div>
      </div>
    </section>

    <!-- =========================
         How You Can Help
    ========================== -->
    <section class="help-section">
      <div class="help-content">
        <div>
          <p class="help-tag">TAKE ACTION</p>

          <h2>How You Can Help</h2>

          <p>
            Small actions can help create more supportive spaces for biodiversity in homes, gardens
            and local communities.
          </p>
        </div>

        <div class="help-list">
          <div class="help-item">
            <strong> Plant native vegetation </strong>

            <span> Native plants can provide food and habitat for local species. </span>
          </div>

          <div class="help-item">
            <strong> Create habitat </strong>

            <span>
              Trees, shrubs, flowers and groundcover can create different habitat layers.
            </span>
          </div>

          <div class="help-item">
            <strong> Support pollinators </strong>

            <span>
              Grow flowering plants and provide diverse resources across different seasons.
            </span>
          </div>

          <div class="help-item">
            <strong> Join local activities </strong>

            <span>
              Community environmental activities can support restoration, monitoring and
              environmental learning.
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.biodiversity-page {
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
  color: #555;

  line-height: 1.8;
}

/* =========================
   Importance
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
   Food Chain
========================= */

.food-chain-section {
  padding: 80px 20px;

  background: #f7faf5;
}

.food-chain-container {
  max-width: 1100px;

  margin: 0 auto;
}

.food-chain {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 14px;

  margin-bottom: 35px;
}

.food-level {
  width: 190px;
  min-height: 175px;

  padding: 24px 16px;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 8px;

  font-family: inherit;

  background: white;

  border: 2px solid transparent;

  border-radius: 18px;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);

  cursor: pointer;

  transition: 0.25s;
}

.food-level:hover {
  transform: translateY(-5px);

  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.food-level.active {
  border-color: #7eb36a;

  background: #eef5ee;
}

.food-icon {
  font-size: 40px;
}

.food-level strong {
  color: #2f6b3b;

  font-size: 18px;

  text-align: center;
}

.food-level small {
  color: #777;

  text-align: center;
}

.chain-arrow {
  color: #7aa66d;

  font-size: 34px;

  font-weight: 700;
}

.food-detail {
  max-width: 760px;

  margin: 0 auto;

  padding: 30px;

  text-align: center;

  background: white;

  border-left: 5px solid #7eb36a;

  border-radius: 16px;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
}

.food-role {
  margin: 0 0 6px;

  color: #7aa66d;

  font-size: 12px;

  font-weight: 700;

  letter-spacing: 2px;

  text-transform: uppercase;
}

.food-detail h3 {
  margin: 0 0 12px;

  color: #2f6b3b;

  font-size: 27px;
}

.food-detail p:last-child {
  margin-bottom: 0;

  color: #555;

  line-height: 1.8;
}

.food-chain-note {
  max-width: 760px;

  margin: 25px auto 0;

  text-align: center;

  color: #687368;

  font-size: 14px;

  line-height: 1.7;
}

/* =========================
   Species
========================= */

.species-section {
  padding: 80px 20px;

  background: #eef5ee;
}

.species-grid {
  max-width: 1100px;

  margin: 0 auto;

  display: grid;

  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: 20px;
}

.species-card {
  width: 100%;

  padding: 28px 22px;

  text-align: left;

  font-family: inherit;

  background: white;

  border: none;

  border-radius: 18px;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);

  cursor: pointer;

  transition: 0.25s;
}

.species-card:hover {
  transform: translateY(-5px);

  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.09);
}

.species-icon {
  display: block;

  margin-bottom: 18px;

  font-size: 38px;
}

.species-card h3 {
  margin-top: 0;

  color: #2f6b3b;

  font-size: 21px;
}

.species-card p {
  color: #555;

  line-height: 1.7;
}

.learn-more {
  display: inline-block;

  margin-top: 12px;

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

.species-modal {
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

.species-modal h2 {
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
   Relationships
========================= */

.relationships-section {
  padding: 80px 20px;

  background: white;
}

.relationship-grid {
  max-width: 1050px;

  margin: 0 auto;

  display: grid;

  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 22px;
}

.relationship-card {
  padding: 28px;

  background: #f7faf5;

  border: 1px solid #e2e9df;

  border-radius: 16px;
}

.relationship-number {
  display: inline-block;

  margin-bottom: 15px;

  color: #8fbe7f;

  font-size: 28px;

  font-weight: 700;
}

.relationship-card h3 {
  margin-top: 0;

  color: #2f6b3b;
}

.relationship-card p {
  margin-bottom: 0;

  color: #555;

  line-height: 1.7;
}

/* =========================
   Threats
========================= */

.threats-section {
  padding: 80px 20px;

  background: #f3f7f1;
}

.threat-grid {
  max-width: 1100px;

  margin: 0 auto;

  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 22px;
}

.threat-card {
  padding: 28px;

  background: white;

  border-left: 5px solid #9a6d59;

  border-radius: 16px;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
}

.threat-card h3 {
  margin-top: 0;

  color: #5f4639;
}

.threat-card p {
  margin-bottom: 0;

  color: #555;

  line-height: 1.7;
}

/* =========================
   How You Can Help
========================= */

.help-section {
  padding: 80px 20px;

  color: white;

  background: linear-gradient(135deg, #5f956d, #8fbe88);
}

.help-content {
  max-width: 1100px;

  margin: 0 auto;

  display: grid;

  grid-template-columns: 1fr 1.2fr;

  gap: 60px;

  align-items: center;
}

.help-tag {
  margin-bottom: 10px;

  font-size: 13px;

  font-weight: 700;

  letter-spacing: 3px;
}

.help-content h2 {
  margin-top: 0;

  font-size: 40px;
}

.help-content p {
  line-height: 1.8;
}

.help-list {
  display: grid;

  gap: 14px;
}

.help-item {
  padding: 20px;

  background: rgba(255, 255, 255, 0.14);

  border: 1px solid rgba(255, 255, 255, 0.2);

  border-radius: 14px;
}

.help-item strong,
.help-item span {
  display: block;
}

.help-item strong {
  margin-bottom: 6px;

  font-size: 18px;
}

.help-item span {
  line-height: 1.6;
}

/* =========================
   Responsive
========================= */

@media (max-width: 950px) {
  .species-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .relationship-grid {
    grid-template-columns: 1fr;
  }

  .food-chain {
    flex-wrap: wrap;
  }
}

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

  .importance-section,
  .food-chain-section,
  .species-section,
  .relationships-section,
  .threats-section {
    padding: 60px 16px;
  }

  .importance-grid,
  .species-grid,
  .threat-grid {
    grid-template-columns: 1fr;
  }

  /* Food chain mobile */

  .food-chain {
    flex-direction: column;

    flex-wrap: nowrap;
  }

  .food-level {
    width: 100%;

    max-width: 320px;
  }

  .chain-arrow {
    transform: rotate(90deg);
  }

  .food-detail {
    padding: 25px 20px;
  }

  /* Modal */

  .species-modal {
    padding: 32px 20px;
  }

  .species-modal h2 {
    font-size: 30px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  /* Help */

  .help-section {
    padding: 60px 20px;
  }

  .help-content {
    grid-template-columns: 1fr;

    gap: 35px;
  }

  .help-content h2 {
    font-size: 32px;
  }
}
</style>
