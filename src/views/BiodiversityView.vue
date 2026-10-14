<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'

const selectedSpecies = ref(null)
const speciesModal = ref(null)
const lastFocusedElement = ref(null)
const speciesSearch = ref('')
const selectedSpeciesCategory = ref('all')

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

const urbanSpeciesList = [
  {
    id: 1,
    name: 'Superb Fairy-wren',
    scientificName: 'Malurus cyaneus',
    category: 'birds',
    icon: '🐦',
    habitat: 'Gardens, parks, shrubland and areas with dense low vegetation.',
    food: 'Small insects and other invertebrates.',
    role: 'Helps control insect populations and contributes to urban food webs.',
    tip: 'Dense native shrubs can provide shelter and safer nesting areas.',
  },

  {
    id: 2,
    name: 'Rainbow Lorikeet',
    scientificName: 'Trichoglossus moluccanus',
    category: 'birds',
    icon: '🦜',
    habitat: 'Urban parks, gardens and areas with flowering trees.',
    food: 'Nectar, pollen, fruit and seeds.',
    role: 'Can contribute to pollination and seed movement.',
    tip: 'Flowering native trees can provide natural food resources.',
  },

  {
    id: 3,
    name: 'Blue-banded Bee',
    scientificName: 'Amegilla cingulata',
    category: 'pollinators',
    icon: '🐝',
    habitat: 'Gardens and areas with flowering plants and suitable nesting spaces.',
    food: 'Nectar and pollen from flowers.',
    role: 'Supports pollination of flowering plants.',
    tip: 'Plant a variety of flowering species and reduce pesticide use.',
  },

  {
    id: 4,
    name: 'Common Brown Butterfly',
    scientificName: 'Heteronympha merope',
    category: 'pollinators',
    icon: '🦋',
    habitat: 'Grasslands, gardens and vegetated urban spaces.',
    food: 'Adults feed on nectar while larvae feed on grasses.',
    role: 'Contributes to pollination and forms part of urban food webs.',
    tip: 'Native grasses and flowering plants can support different life stages.',
  },

  {
    id: 5,
    name: 'River Red Gum',
    scientificName: 'Eucalyptus camaldulensis',
    category: 'plants',
    icon: '🌳',
    habitat: 'Open woodland, waterways and suitable urban green spaces.',
    food: 'Produces flowers, nectar and habitat resources used by wildlife.',
    role: 'Provides food, shelter and nesting habitat for many species.',
    tip: 'Large trees require appropriate space for mature growth.',
  },

  {
    id: 6,
    name: 'Correa',
    scientificName: 'Correa reflexa',
    category: 'plants',
    icon: '🌿',
    habitat: 'Gardens, shrubland and native planting areas.',
    food: 'Flowers provide nectar for birds and insects.',
    role: 'Supports pollinators and provides low-level habitat structure.',
    tip: 'Useful for adding native flowering vegetation to smaller gardens.',
  },

  {
    id: 7,
    name: 'Ladybird',
    scientificName: 'Coccinellidae',
    category: 'insects',
    icon: '🐞',
    habitat: 'Gardens, parks and areas containing vegetation.',
    food: 'Many species feed on aphids and other small insects.',
    role: 'Can help regulate populations of plant-feeding insects.',
    tip: 'Avoid unnecessary pesticide use to support beneficial insects.',
  },

  {
    id: 8,
    name: 'Dragonfly',
    scientificName: 'Anisoptera',
    category: 'insects',
    icon: '🪰',
    habitat: 'Wetlands, ponds, waterways and nearby vegetation.',
    food: 'Other insects, including small flying insects.',
    role: 'Acts as a predator and contributes to aquatic and terrestrial food webs.',
    tip: 'Healthy ponds and wetland vegetation can provide useful habitat.',
  },
]

const filteredUrbanSpecies = computed(() => {
  const search = speciesSearch.value.trim().toLowerCase()

  return urbanSpeciesList.filter((species) => {
    const matchesCategory =
      selectedSpeciesCategory.value === 'all' || species.category === selectedSpeciesCategory.value

    const matchesSearch =
      species.name.toLowerCase().includes(search) ||
      species.scientificName.toLowerCase().includes(search)

    return matchesCategory && matchesSearch
  })
})

const resetSpeciesFilters = () => {
  speciesSearch.value = ''
  selectedSpeciesCategory.value = 'all'
}

const currentSpecies = computed(() => {
  if (!selectedSpecies.value) {
    return null
  }

  return speciesData[selectedSpecies.value]
})

const openUrbanSpecies = async (species) => {
  lastFocusedElement.value = document.activeElement

  selectedSpecies.value = species

  await nextTick()

  speciesModal.value?.focus()
}

const closeSpecies = async () => {
  selectedSpecies.value = null

  await nextTick()

  lastFocusedElement.value?.focus()
}

const handleModalKeydown = (event) => {
  if (event.key === 'Escape' && selectedSpecies.value) {
    closeSpecies()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleModalKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleModalKeydown)
})

/* =========================
   Interactive Food Chain
========================= */

const foodChainOrder = ['producer', 'primary', 'secondary', 'tertiary']

const foodChainData = {
  producer: {
    title: 'Native Plants',
    icon: '🌿',
    role: 'Producer',
    trophicLevel: 'Level 1',
    description:
      'Native plants capture energy from sunlight and form the foundation of the urban food chain.',

    consumes: 'Sunlight, water and nutrients from the soil',

    consumedBy: 'Plant-feeding insects and other herbivores',

    ecosystemRole:
      'Provides nectar, leaves, seeds, fruit and habitat that support many other urban species.',
  },

  primary: {
    title: 'Insects',
    icon: '🐛',
    role: 'Primary Consumer',
    trophicLevel: 'Level 2',
    description:
      'Plant-feeding insects transfer energy from vegetation to animals at higher trophic levels.',

    consumes: 'Leaves, nectar, seeds and other plant material',

    consumedBy: 'Small insect-eating birds and other predators',

    ecosystemRole:
      'Supports pollination, decomposition and provides an important food source for urban wildlife.',
  },

  secondary: {
    title: 'Small Birds',
    icon: '🐦',
    role: 'Secondary Consumer',
    trophicLevel: 'Level 3',
    description:
      'Many small urban birds feed on insects and other invertebrates, moving energy higher through the food chain.',

    consumes: 'Insects, larvae and other small invertebrates',

    consumedBy: 'Birds of prey and other larger predators',

    ecosystemRole:
      'Helps control insect populations and connects lower trophic levels with larger predators.',
  },

  tertiary: {
    title: 'Birds of Prey',
    icon: '🦅',
    role: 'Higher-Level Consumer',
    trophicLevel: 'Level 4',
    description:
      'Birds of prey occupy a higher trophic level and may feed on smaller birds and other animals.',

    consumes: 'Smaller birds and other animals',

    consumedBy: 'Few natural predators in this simplified urban food chain',

    ecosystemRole: 'Helps regulate prey populations and contributes to ecological balance.',
  },
}

const currentFoodLevel = computed(() => {
  return foodChainData[selectedFoodLevel.value]
})

const selectedFoodIndex = computed(() => {
  return foodChainOrder.indexOf(selectedFoodLevel.value)
})

const selectFoodLevel = (level) => {
  selectedFoodLevel.value = level
}

const isRelatedFoodLevel = (level) => {
  const index = foodChainOrder.indexOf(level)

  return Math.abs(index - selectedFoodIndex.value) === 1
}

const isDimmedFoodLevel = (level) => {
  return level !== selectedFoodLevel.value && !isRelatedFoodLevel(level)
}

const isActiveArrow = (index) => {
  return selectedFoodIndex.value === index || selectedFoodIndex.value === index + 1
}
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
        <!-- Interactive Food Chain -->
        <div class="food-chain" aria-label="Interactive urban food chain">
          <!-- Producer -->
          <button
            type="button"
            class="food-level"
            :class="{
              active: selectedFoodLevel === 'producer',

              related: isRelatedFoodLevel('producer'),

              dimmed: isDimmedFoodLevel('producer'),
            }"
            @click="selectFoodLevel('producer')"
          >
            <span class="trophic-number"> 01 </span>

            <span class="food-icon" aria-hidden="true"> 🌿 </span>

            <strong> Native Plants </strong>

            <small> Producer </small>
          </button>

          <div
            class="chain-arrow"
            :class="{
              active: isActiveArrow(0),
            }"
            aria-hidden="true"
          >
            →
          </div>

          <!-- Primary Consumer -->
          <button
            type="button"
            class="food-level"
            :class="{
              active: selectedFoodLevel === 'primary',

              related: isRelatedFoodLevel('primary'),

              dimmed: isDimmedFoodLevel('primary'),
            }"
            @click="selectFoodLevel('primary')"
          >
            <span class="trophic-number"> 02 </span>

            <span class="food-icon" aria-hidden="true"> 🐛 </span>

            <strong> Insects </strong>

            <small> Primary Consumer </small>
          </button>

          <div
            class="chain-arrow"
            :class="{
              active: isActiveArrow(1),
            }"
            aria-hidden="true"
          >
            →
          </div>

          <!-- Secondary Consumer -->
          <button
            type="button"
            class="food-level"
            :class="{
              active: selectedFoodLevel === 'secondary',

              related: isRelatedFoodLevel('secondary'),

              dimmed: isDimmedFoodLevel('secondary'),
            }"
            @click="selectFoodLevel('secondary')"
          >
            <span class="trophic-number"> 03 </span>

            <span class="food-icon" aria-hidden="true"> 🐦 </span>

            <strong> Small Birds </strong>

            <small> Secondary Consumer </small>
          </button>

          <div
            class="chain-arrow"
            :class="{
              active: isActiveArrow(2),
            }"
            aria-hidden="true"
          >
            →
          </div>

          <!-- Higher Consumer -->
          <button
            type="button"
            class="food-level"
            :class="{
              active: selectedFoodLevel === 'tertiary',

              related: isRelatedFoodLevel('tertiary'),

              dimmed: isDimmedFoodLevel('tertiary'),
            }"
            @click="selectFoodLevel('tertiary')"
          >
            <span class="trophic-number"> 04 </span>

            <span class="food-icon" aria-hidden="true"> 🦅 </span>

            <strong> Birds of Prey </strong>

            <small> Higher-Level Consumer </small>
          </button>
        </div>

        <!-- Selected Level Details -->
        <div class="food-explorer" aria-live="polite">
          <div class="food-overview">
            <p class="food-role">
              {{ currentFoodLevel.trophicLevel }}
              ·
              {{ currentFoodLevel.role }}
            </p>

            <div class="food-title-row">
              <span class="food-detail-icon" aria-hidden="true">
                {{ currentFoodLevel.icon }}
              </span>

              <h3>
                {{ currentFoodLevel.title }}
              </h3>
            </div>

            <p class="food-description">
              {{ currentFoodLevel.description }}
            </p>
          </div>

          <div class="food-relationships">
            <article class="relationship-detail">
              <span class="relationship-icon" aria-hidden="true"> 🍽️ </span>

              <div>
                <strong> What it consumes </strong>

                <p>
                  {{ currentFoodLevel.consumes }}
                </p>
              </div>
            </article>

            <article class="relationship-detail">
              <span class="relationship-icon" aria-hidden="true"> 🔗 </span>

              <div>
                <strong> Consumed by </strong>

                <p>
                  {{ currentFoodLevel.consumedBy }}
                </p>
              </div>
            </article>

            <article class="relationship-detail">
              <span class="relationship-icon" aria-hidden="true"> 🌱 </span>

              <div>
                <strong> Ecosystem role </strong>

                <p>
                  {{ currentFoodLevel.ecosystemRole }}
                </p>
              </div>
            </article>
          </div>
        </div>

        <p class="food-chain-note">
          The arrows show the direction of energy transfer. Select any organism to highlight its
          direct relationship with neighbouring trophic levels.
        </p>
      </div>
    </section>

    <!-- =========================
         Urban Species
    ========================== -->
    <section class="species-section">
      <div class="section-header">
        <p class="section-tag">DISCOVER URBAN NATURE</p>

        <h2>Urban Species Explorer</h2>

        <div class="section-line"></div>

        <p>
          Search and filter urban species to learn how plants, birds, pollinators and insects
          contribute to biodiversity.
        </p>
      </div>

      <!-- Explorer Controls -->

      <div class="species-explorer-controls">
        <div class="species-search">
          <label for="species-search"> Search species </label>

          <input
            id="species-search"
            v-model="speciesSearch"
            type="search"
            placeholder="Search by common or scientific name..."
          />
        </div>

        <div class="species-filter">
          <label for="species-category"> Category </label>

          <select id="species-category" v-model="selectedSpeciesCategory">
            <option value="all">All Species</option>

            <option value="birds">Birds</option>

            <option value="pollinators">Pollinators</option>

            <option value="plants">Native Plants</option>

            <option value="insects">Insects</option>
          </select>
        </div>

        <button type="button" class="species-reset-button" @click="resetSpeciesFilters">
          Reset Filters
        </button>
      </div>

      <!-- Result Count -->

      <div class="species-result-info">
        Showing

        <strong>
          {{ filteredUrbanSpecies.length }}
        </strong>

        species
      </div>

      <!-- Species Cards -->

      <div v-if="filteredUrbanSpecies.length" class="species-grid">
        <button
          v-for="species in filteredUrbanSpecies"
          :key="species.id"
          type="button"
          class="species-card"
          @click="openUrbanSpecies(species)"
        >
          <span class="species-icon" aria-hidden="true">
            {{ species.icon }}
          </span>

          <span class="species-category-label">
            {{ species.category }}
          </span>

          <h3>
            {{ species.name }}
          </h3>

          <p class="scientific-species-name">
            {{ species.scientificName }}
          </p>

          <p>
            {{ species.role }}
          </p>

          <span class="learn-more"> Explore Species → </span>
        </button>
      </div>

      <!-- No Results -->

      <div v-else class="species-no-results" role="status">
        <strong> No species found </strong>

        <p>Try another search term or category.</p>
      </div>
    </section>

    <!-- =========================
         Species Modal
    ========================== -->
    <div v-if="selectedSpecies" class="modal-overlay" @click.self="closeSpecies">
      <div
        ref="speciesModal"
        class="species-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="species-modal-title"
        tabindex="-1"
      >
        <button
          type="button"
          class="close-button"
          @click="closeSpecies"
          aria-label="Close species information"
        >
          ×
        </button>

        <p class="modal-tag">URBAN SPECIES EXPLORER</p>

        <div class="species-modal-title">
          <span class="modal-species-icon" aria-hidden="true">
            {{ selectedSpecies.icon }}
          </span>

          <div>
            <h2 id="species-modal-title">
              {{ selectedSpecies.name }}
            </h2>

            <p class="modal-scientific-name">
              {{ selectedSpecies.scientificName }}
            </p>
          </div>
        </div>

        <div class="modal-line"></div>

        <div class="species-detail-grid">
          <article class="species-detail-item">
            <span aria-hidden="true"> 🏡 </span>

            <div>
              <h3>Habitat</h3>

              <p>
                {{ selectedSpecies.habitat }}
              </p>
            </div>
          </article>

          <article class="species-detail-item">
            <span aria-hidden="true"> 🍽️ </span>

            <div>
              <h3>Food Source / Diet</h3>

              <p>
                {{ selectedSpecies.food }}
              </p>
            </div>
          </article>

          <article class="species-detail-item">
            <span aria-hidden="true"> 🌱 </span>

            <div>
              <h3>Ecosystem Role</h3>

              <p>
                {{ selectedSpecies.role }}
              </p>
            </div>
          </article>

          <article class="species-detail-item">
            <span aria-hidden="true"> 💡 </span>

            <div>
              <h3>Urban Biodiversity Tip</h3>

              <p>
                {{ selectedSpecies.tip }}
              </p>
            </div>
          </article>
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
   Interactive Food Chain
========================= */

.food-chain-section {
  padding: 80px 20px;

  background: #f7faf5;
}

.food-chain-container {
  max-width: 1150px;

  margin: 0 auto;
}

/* Chain */

.food-chain {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 12px;

  margin-bottom: 35px;
}

/* Level */

.food-level {
  position: relative;

  width: 190px;
  min-height: 190px;

  padding: 25px 16px;

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

  transition:
    transform 0.25s,
    opacity 0.25s,
    border-color 0.25s,
    box-shadow 0.25s,
    background 0.25s;
}

.food-level:hover {
  transform: translateY(-5px);

  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.food-level.active {
  transform: translateY(-6px);

  background: #e6f2e3;

  border-color: #2f6b3b;

  box-shadow: 0 12px 28px rgba(47, 107, 59, 0.15);
}

.food-level.related {
  background: #f4f8f2;

  border-color: #a8c5a1;
}

.food-level.dimmed {
  opacity: 0.48;
}

.food-level:focus-visible {
  outline: 3px solid #2f6b3b;

  outline-offset: 4px;
}

.trophic-number {
  position: absolute;

  top: 13px;
  left: 15px;

  color: #7aa66d;

  font-size: 11px;
  font-weight: 800;

  letter-spacing: 1px;
}

.food-icon {
  font-size: 42px;
}

.food-level strong {
  color: #2f6b3b;

  font-size: 18px;

  text-align: center;
}

.food-level small {
  color: #616b62;

  text-align: center;

  line-height: 1.4;
}

/* Arrow */

.chain-arrow {
  color: #bdcabc;

  font-size: 34px;

  font-weight: 700;

  transition:
    color 0.25s,
    transform 0.25s;
}

.chain-arrow.active {
  color: #2f6b3b;

  transform: scale(1.15);
}

/* Explorer */

.food-explorer {
  display: grid;

  grid-template-columns:
    minmax(0, 0.9fr)
    minmax(0, 1.1fr);

  gap: 24px;

  max-width: 950px;

  margin: 0 auto;

  padding: 30px;

  background: #ffffff;

  border: 1px solid #dce7d9;

  border-radius: 18px;

  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.food-overview {
  padding-right: 25px;

  border-right: 1px solid #e1e9df;
}

.food-role {
  margin: 0 0 12px;

  color: #65865f;

  font-size: 12px;

  font-weight: 800;

  letter-spacing: 1.8px;

  text-transform: uppercase;
}

.food-title-row {
  display: flex;

  align-items: center;

  gap: 12px;

  margin-bottom: 15px;
}

.food-detail-icon {
  font-size: 38px;
}

.food-title-row h3 {
  margin: 0;

  color: #2f6b3b;

  font-size: 26px;
}

.food-description {
  margin: 0;

  color: #555;

  line-height: 1.75;
}

/* Relationships */

.food-relationships {
  display: grid;

  gap: 12px;
}

.relationship-detail {
  display: grid;

  grid-template-columns: 38px 1fr;

  gap: 12px;

  padding: 14px 16px;

  background: #f8fbf6;

  border: 1px solid #e1e9df;

  border-radius: 11px;
}

.relationship-icon {
  font-size: 21px;
}

.relationship-detail strong {
  display: block;

  margin-bottom: 4px;

  color: #2f6b3b;

  font-size: 14px;
}

.relationship-detail p {
  margin: 0;

  color: #555;

  font-size: 14px;

  line-height: 1.55;
}

/* Note */

.food-chain-note {
  max-width: 800px;

  margin: 24px auto 0;

  text-align: center;

  color: #5c695e;

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
/* =========================
   Urban Species Explorer
========================= */

.species-explorer-controls {
  max-width: 1100px;

  margin: 0 auto 20px;

  display: grid;

  grid-template-columns:
    minmax(0, 1.5fr)
    minmax(180px, 0.8fr)
    auto;

  gap: 16px;

  align-items: end;
}

.species-search,
.species-filter {
  display: flex;

  flex-direction: column;

  gap: 7px;
}

.species-search label,
.species-filter label {
  color: #2f6b3b;

  font-size: 14px;

  font-weight: 700;
}

.species-search input,
.species-filter select {
  width: 100%;

  min-height: 46px;

  padding: 10px 13px;

  font: inherit;

  color: #37463a;

  background: white;

  border: 1px solid #cfdccf;

  border-radius: 10px;
}

.species-search input:focus,
.species-filter select:focus {
  outline: 3px solid rgba(47, 107, 59, 0.18);

  border-color: #2f6b3b;
}

.species-reset-button {
  min-height: 46px;

  padding: 10px 18px;

  font: inherit;

  font-weight: 700;

  color: white;

  background: #2f6b3b;

  border: none;

  border-radius: 10px;

  cursor: pointer;
}

.species-reset-button:hover {
  background: #255830;
}

.species-reset-button:focus-visible {
  outline: 3px solid #2f6b3b;

  outline-offset: 3px;
}

.species-result-info {
  max-width: 1100px;

  margin: 0 auto 20px;

  color: #657066;

  font-size: 14px;
}

.species-category-label {
  display: inline-block;

  margin-bottom: 8px;

  color: #688a63;

  font-size: 11px;

  font-weight: 800;

  letter-spacing: 1.5px;

  text-transform: uppercase;
}

.scientific-species-name {
  margin-top: -6px;

  color: #6c776e !important;

  font-size: 14px;

  font-style: italic;
}

.species-no-results {
  max-width: 600px;

  margin: 25px auto 0;

  padding: 35px;

  text-align: center;

  background: white;

  border: 1px solid #dfe8dc;

  border-radius: 14px;
}

.species-no-results strong {
  color: #2f6b3b;

  font-size: 20px;
}

/* Species Modal */

.species-modal-title {
  display: flex;

  align-items: center;

  gap: 18px;
}

.modal-species-icon {
  font-size: 52px;
}

.modal-scientific-name {
  margin: 5px 0 0;

  color: #687369;

  font-style: italic;
}

.species-detail-grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 16px;

  margin-top: 25px;
}

.species-detail-item {
  display: grid;

  grid-template-columns: 38px 1fr;

  gap: 12px;

  padding: 20px;

  background: #f7faf5;

  border: 1px solid #e0e9dd;

  border-radius: 13px;
}

.species-detail-item > span {
  font-size: 23px;
}

.species-detail-item h3 {
  margin: 0 0 7px;

  color: #2f6b3b;

  font-size: 16px;
}

.species-detail-item p {
  margin: 0;

  color: #555;

  line-height: 1.65;
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
.species-modal:focus {
  outline: none;
}

.close-button:focus-visible {
  outline: 3px solid #2f6b3b;
  outline-offset: 3px;
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

    max-width: 340px;
  }

  .chain-arrow {
    transform: rotate(90deg);
  }

  .chain-arrow.active {
    transform: rotate(90deg) scale(1.15);
  }

  .food-explorer {
    grid-template-columns: 1fr;

    padding: 22px 18px;
  }

  .food-overview {
    padding-right: 0;

    padding-bottom: 22px;

    border-right: none;

    border-bottom: 1px solid #e1e9df;
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

  .species-explorer-controls {
    grid-template-columns: 1fr;
  }

  .species-reset-button {
    width: 100%;
  }

  .species-detail-grid {
    grid-template-columns: 1fr;
  }

  .species-modal-title {
    align-items: flex-start;
  }

  .modal-species-icon {
    font-size: 42px;
  }
}
</style>
