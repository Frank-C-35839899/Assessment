<script setup>
import { ref, computed } from 'vue'
import { httpsCallable } from 'firebase/functions'
import { functions } from '../firebase'

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

const aiRecommendation = ref(null)

const aiLoading = ref(false)

const aiError = ref('')

const recommendationSource = ref('')
const buildFallbackRecommendation = () => {
  const { sunlight, space, drainage } = treeSelection.value

  const sunlightText = {
    full: 'full sun',
    partial: 'partial sun',
    shade: 'shaded conditions',
  }

  const drainageText = {
    well: 'well-drained soil',
    moderate: 'moderately drained soil',
    poor: 'slower-draining soil',
  }

  const spaceText = {
    small: 'up to 10 m²',
    medium: '10–30 m²',
    large: 'over 30 m²',
  }

  if (space === 'small') {
    return {
      summary: `For a small planting area (${spaceText[space]}), compact native plants and smaller trees are generally more appropriate.`,
      recommendations: [
        {
          commonName: 'Compact Native Shrub',
          scientificName: 'Local rule-based suggestion',
          reason: `A compact plant is more appropriate for restricted spaces and ${sunlightText[sunlight]}.`,
          size: 'Best suited to smaller gardens and restricted planting areas.',
          careTip: `Choose a variety that is compatible with ${drainageText[drainage]}.`,
        },
        {
          commonName: 'Small Native Tree',
          scientificName: 'Local rule-based suggestion',
          reason:
            'A small tree may provide shade and habitat without requiring a large canopy area.',
          size: 'Choose a species with a compact mature canopy and root system.',
          careTip: 'Check mature height and width before planting near buildings or paths.',
        },
        {
          commonName: 'Large Native Shrub',
          scientificName: 'Local rule-based suggestion',
          reason:
            'A larger shrub may provide greenery and biodiversity benefits where a full-sized tree is unsuitable.',
          size: 'Suitable for courtyards, garden beds and other limited spaces.',
          careTip: 'Allow adequate clearance from fences, walls and underground services.',
        },
      ],
      disclaimer:
        'This is a rule-based fallback recommendation. Check local conditions and seek professional horticultural advice when necessary.',
    }
  }

  if (space === 'medium') {
    return {
      summary: `For a medium planting area (${spaceText[space]}), small-to-medium native trees can provide useful canopy cover while remaining manageable.`,
      recommendations: [
        {
          commonName: 'Medium Native Tree',
          scientificName: 'Local rule-based suggestion',
          reason: `Suitable for medium-sized spaces with ${sunlightText[sunlight]}.`,
          size: 'A moderate canopy size is generally more appropriate for this space.',
          careTip: `Select a species suited to ${drainageText[drainage]}.`,
        },
        {
          commonName: 'Small Canopy Tree',
          scientificName: 'Local rule-based suggestion',
          reason: 'Can provide shade and habitat without the spatial requirements of a large tree.',
          size: 'Suitable for many suburban front yards and medium gardens.',
          careTip: 'Consider distance from buildings, paths and overhead infrastructure.',
        },
        {
          commonName: 'Native Habitat Tree',
          scientificName: 'Local rule-based suggestion',
          reason: 'Native vegetation can support birds, insects and other local wildlife.',
          size: 'Choose a mature size compatible with the available 10–30 m² area.',
          careTip: 'Check local nursery or council guidance for species suited to your suburb.',
        },
      ],
      disclaimer:
        'This is a rule-based fallback recommendation. Check local conditions and seek professional horticultural advice when necessary.',
    }
  }

  return {
    summary: `For a large planting area (${spaceText[space]}), larger canopy trees may provide greater long-term shade, habitat and urban cooling benefits.`,
    recommendations: [
      {
        commonName: 'Large Native Canopy Tree',
        scientificName: 'Local rule-based suggestion',
        reason: `A larger site can accommodate a wider canopy and root system under ${sunlightText[sunlight]}.`,
        size: 'Suitable for larger backyards, parks or community green spaces.',
        careTip: `Choose a species compatible with ${drainageText[drainage]}.`,
      },
      {
        commonName: 'Native Shade Tree',
        scientificName: 'Local rule-based suggestion',
        reason: 'A shade tree can contribute to urban cooling and provide habitat.',
        size: 'Requires adequate clearance for mature canopy and roots.',
        careTip: 'Keep sufficient distance from buildings, paths and utilities.',
      },
      {
        commonName: 'Biodiversity Tree',
        scientificName: 'Local rule-based suggestion',
        reason:
          'A larger native tree can provide food, shelter and nesting opportunities for wildlife.',
        size: 'Best suited to areas where long-term growth can be accommodated.',
        careTip: 'Consider local indigenous species where appropriate.',
      },
    ],
    disclaimer:
      'This is a rule-based fallback recommendation. Check local conditions and seek professional horticultural advice when necessary.',
  }
}

const treeRecommendation = ref(null)
const activeGuide = ref('sunlight')

const guideData = {
  sunlight: {
    title: 'Sunlight Guide',
    intro: 'Estimate how much direct sunlight the planting area receives on a typical day.',
    options: [
      {
        title: 'Full Sun',
        value: '6+ hours/day',
        text: 'Open garden areas that receive long periods of direct sunlight.',
      },
      {
        title: 'Partial Sun',
        value: '3–6 hours/day',
        text: 'Areas receiving morning or afternoon sun with some shade.',
      },
      {
        title: 'Shade',
        value: 'Less than 3 hours/day',
        text: 'Areas shaded by buildings, fences or larger trees.',
      },
    ],
  },

  space: {
    title: 'Available Space Guide',
    intro: 'Consider the ground area available for the tree when it reaches maturity.',
    options: [
      {
        title: 'Small',
        value: 'Up to 10 m²',
        text: 'Suitable for courtyards, narrow garden beds or other restricted spaces.',
      },
      {
        title: 'Medium',
        value: '10–30 m²',
        text: 'Suitable for a typical front yard or medium-sized garden.',
      },
      {
        title: 'Large',
        value: 'Over 30 m²',
        text: 'Suitable for backyards, parks or community green spaces.',
      },
    ],
  },

  drainage: {
    title: 'Soil Drainage Guide',
    intro: 'Think about what normally happens to the soil after rainfall or watering.',
    options: [
      {
        title: 'Well-drained',
        value: 'Drains within a few hours',
        text: 'Common in raised garden beds, sandy soil or loamy soil.',
      },
      {
        title: 'Moderate',
        value: 'Stays moist temporarily',
        text: 'Typical garden soil that retains some moisture without becoming waterlogged.',
      },
      {
        title: 'Poor Drainage',
        value: 'Water remains for many hours',
        text: 'Common in heavy clay soil, low-lying areas or places where puddles form.',
      },
    ],
  },
}

const currentGuide = computed(() => guideData[activeGuide.value])

const showGuide = (guide) => {
  activeGuide.value = guide
}

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
const generateAIRecommendation = async () => {
  aiError.value = ''
  aiRecommendation.value = null
  recommendationSource.value = ''

  const sunlight = treeSelection.value.sunlight
  const space = treeSelection.value.space
  const drainage = treeSelection.value.drainage

  if (!sunlight || !space || !drainage) {
    aiError.value =
      'Please select sunlight, available space and soil drainage before generating a recommendation.'

    return
  }

  aiLoading.value = true

  try {
    const generateRecommendation = httpsCallable(functions, 'generatePlantRecommendation')

    const result = await generateRecommendation({
      sunlight,
      space,
      drainage,
    })

    if (!result.data || !result.data.success || !result.data.recommendation) {
      throw new Error('No AI recommendation was returned.')
    }

    aiRecommendation.value = result.data.recommendation

    recommendationSource.value = 'ai'
  } catch (error) {
    console.error('AI recommendation unavailable. Using fallback:', error)

    aiRecommendation.value = buildFallbackRecommendation()

    recommendationSource.value = 'fallback'
  } finally {
    aiLoading.value = false
  }
}

const resetTreeSelection = () => {
  treeSelection.value = {
    sunlight: '',
    space: '',
    drainage: '',
  }

  treeRecommendation.value = null

  aiRecommendation.value = null
  aiError.value = ''
  aiLoading.value = false
  recommendationSource.value = ''

  activeGuide.value = 'sunlight'
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
      <!-- Tree Selection Tool -->
      <div class="tree-selector">
        <div class="selector-header">
          <p class="selector-tag">INTERACTIVE TOOL</p>
          <h3>Tree Selection Guide</h3>
          <p>
            Select the conditions that best describe your planting site. Need help? Open a guide on
            the right.
          </p>
        </div>

        <div class="selector-layout">
          <!-- LEFT: Selection -->
          <div class="selector-panel">
            <div class="selector-panel-header">
              <span class="panel-number">01</span>

              <div>
                <h4>Your Planting Site</h4>
                <p>Choose one option for each condition.</p>
              </div>
            </div>

            <!-- Sunlight -->
            <div class="selector-field">
              <div class="field-heading">
                <label for="sunlight">Sunlight</label>

                <button
                  type="button"
                  class="guide-button"
                  :class="{ active: activeGuide === 'sunlight' }"
                  @click="showGuide('sunlight')"
                >
                  View guide →
                </button>
              </div>

              <select id="sunlight" v-model="treeSelection.sunlight">
                <option value="">Select sunlight</option>
                <option value="full">Full Sun — 6+ hours/day</option>
                <option value="partial">Partial Sun — 3–6 hours/day</option>
                <option value="shade">Shade — less than 3 hours/day</option>
              </select>
            </div>

            <!-- Available Space -->
            <div class="selector-field">
              <div class="field-heading">
                <label for="space">Available Space</label>

                <button
                  type="button"
                  class="guide-button"
                  :class="{ active: activeGuide === 'space' }"
                  @click="showGuide('space')"
                >
                  View guide →
                </button>
              </div>

              <select id="space" v-model="treeSelection.space">
                <option value="">Select available space</option>
                <option value="small">Small — up to 10 m²</option>
                <option value="medium">Medium — 10–30 m²</option>
                <option value="large">Large — over 30 m²</option>
              </select>
            </div>

            <!-- Soil Drainage -->
            <div class="selector-field">
              <div class="field-heading">
                <label for="drainage">Soil Drainage</label>

                <button
                  type="button"
                  class="guide-button"
                  :class="{ active: activeGuide === 'drainage' }"
                  @click="showGuide('drainage')"
                >
                  View guide →
                </button>
              </div>

              <select id="drainage" v-model="treeSelection.drainage">
                <option value="">Select soil drainage</option>
                <option value="well">Well-drained — drains within a few hours</option>
                <option value="moderate">Moderate — stays moist temporarily</option>
                <option value="poor">Poor drainage — water remains or puddles form</option>
              </select>
            </div>

            <!-- Buttons -->
            <div class="selector-actions">
              <button
                type="button"
                class="recommend-button"
                :disabled="aiLoading"
                :aria-busy="aiLoading ? 'true' : 'false'"
                @click="generateAIRecommendation"
              >
                {{
                  aiLoading ? 'Generating Recommendation...' : 'Generate AI Plant Recommendation'
                }}
              </button>

              <button type="button" class="reset-button" @click="resetTreeSelection">Reset</button>
            </div>
          </div>

          <!-- RIGHT: Guide -->
          <aside class="guide-panel" aria-live="polite">
            <div class="guide-panel-top">
              <span class="panel-number guide-number">02</span>

              <div>
                <p class="guide-label">CONDITION GUIDE</p>
                <h4>{{ currentGuide.title }}</h4>
              </div>
            </div>

            <p class="guide-intro">
              {{ currentGuide.intro }}
            </p>

            <div class="guide-option-list">
              <div
                v-for="option in currentGuide.options"
                :key="option.title"
                class="guide-option-card"
              >
                <div class="guide-option-title">
                  <strong>{{ option.title }}</strong>
                  <span>{{ option.value }}</span>
                </div>

                <p>{{ option.text }}</p>
              </div>
            </div>

            <div class="guide-tip">
              <strong>Tip</strong>
              <p>
                If you are unsure, observe the planting site after rainfall and at different times
                of the day before making your selection.
              </p>
            </div>
          </aside>
        </div>
        <!-- =========================
     AI Error
========================== -->

        <div v-if="aiError" class="ai-error" role="alert">
          {{ aiError }}
        </div>

        <!-- =========================
     AI Recommendation
========================== -->

        <section
          v-if="aiRecommendation"
          class="ai-recommendation"
          aria-labelledby="ai-recommendation-title"
          aria-live="polite"
        >
          <div class="ai-result-header">
            <p class="ai-tag">
              <strong>
                {{
                  recommendationSource === 'ai' ? 'AI-generated guidance' : 'Rule-based guidance'
                }}
              </strong>
            </p>

            <h3 id="ai-recommendation-title">Recommended Plants for Your Site</h3>

            <div v-if="recommendationSource === 'fallback'" class="fallback-notice">
              The AI service is currently unavailable, so a local rule-based recommendation is being
              shown instead.
            </div>

            <p>
              {{ aiRecommendation.summary }}
            </p>
          </div>

          <div class="ai-plant-grid">
            <article
              v-for="(plant, index) in aiRecommendation.recommendations"
              :key="plant.scientificName || plant.commonName"
              class="ai-plant-card"
            >
              <span class="plant-number"> 0{{ index + 1 }} </span>

              <h4>
                {{ plant.commonName }}
              </h4>

              <p class="scientific-name">
                <em>
                  {{ plant.scientificName }}
                </em>
              </p>

              <div class="plant-detail">
                <strong> Why it may suit your site </strong>

                <p>
                  {{ plant.reason }}
                </p>
              </div>

              <div class="plant-detail">
                <strong> Mature Size </strong>

                <p>
                  {{ plant.size }}
                </p>
              </div>

              <div class="plant-detail">
                <strong> Care Tip </strong>

                <p>
                  {{ plant.careTip }}
                </p>
              </div>
            </article>
          </div>

          <div class="ai-disclaimer">
            <strong> AI-generated guidance </strong>

            <p>
              {{
                aiRecommendation.disclaimer ||
                'Recommendations are generated by AI. Check local conditions and seek professional advice when necessary.'
              }}
            </p>
          </div>
        </section>
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
/* =========================
   Tree Selection Guide
========================= */

.tree-selector {
  max-width: 1120px;
  margin: 0 auto 45px;
  padding: 38px;
  background: #eef5ee;
  border: 1px solid #dce8d9;
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(47, 107, 59, 0.07);
}

.selector-header {
  max-width: 720px;
  margin: 0 auto 34px;
  text-align: center;
}

.selector-tag {
  margin: 0 0 8px;
  color: #7aa66d;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
}

.selector-header h3 {
  margin: 0 0 10px;
  color: #2f6b3b;
  font-size: 30px;
}

.selector-header p {
  margin: 0;
  color: #555;
  line-height: 1.7;
}

/* Two-column layout */

.selector-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 28px;
  align-items: stretch;
}

/* Left panel */

.selector-panel,
.guide-panel {
  padding: 28px;
  background: #ffffff;
  border: 1px solid #dbe6d8;
  border-radius: 18px;
}

.selector-panel-header,
.guide-panel-top {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 26px;
}

.panel-number {
  display: flex;
  flex: 0 0 42px;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  background: #e5f0e2;
  color: #2f6b3b;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 800;
}

.selector-panel-header h4,
.guide-panel h4 {
  margin: 0 0 5px;
  color: #263c2b;
  font-size: 20px;
}

.selector-panel-header p {
  margin: 0;
  color: #667268;
  font-size: 14px;
}

/* Fields */

.selector-field {
  padding: 20px 0;
  border-top: 1px solid #e5ece3;
}

.selector-field:first-of-type {
  border-top: none;
  padding-top: 4px;
}

.field-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 9px;
}

.field-heading label {
  color: #263c2b;
  font-size: 16px;
  font-weight: 700;
}

.selector-field select {
  width: 100%;
  min-height: 46px;
  padding: 11px 40px 11px 13px;
  font-family: inherit;
  font-size: 15px;
  color: #333;
  background: #fbfdfb;
  border: 1px solid #bdcdb9;
  border-radius: 9px;
  cursor: pointer;
}

.selector-field select:hover {
  border-color: #7aa66d;
}

.selector-field select:focus {
  outline: 3px solid rgba(47, 107, 59, 0.16);
  outline-offset: 2px;
  border-color: #2f6b3b;
}

/* View guide */

.guide-button {
  padding: 5px 0;
  color: #52765a;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  background: transparent;
  border: none;
  cursor: pointer;
}

.guide-button:hover,
.guide-button.active {
  color: #2f6b3b;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.guide-button:focus-visible {
  outline: 3px solid rgba(47, 107, 59, 0.22);
  outline-offset: 3px;
  border-radius: 3px;
}

/* Actions */

.selector-actions {
  display: flex;
  gap: 12px;
  margin-top: 22px;
}

.recommend-button,
.reset-button {
  min-height: 46px;
  padding: 12px 20px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  border-radius: 9px;
  cursor: pointer;
  transition: 0.2s;
}

.recommend-button {
  flex: 1;
  color: #ffffff;
  background: #2f6b3b;
  border: 1px solid #2f6b3b;
}

.recommend-button:hover {
  background: #25552f;
  transform: translateY(-1px);
}

.reset-button {
  color: #2f6b3b;
  background: #ffffff;
  border: 1px solid #b9cdb5;
}

.reset-button:hover {
  background: #f4f8f2;
}

.recommend-button:focus-visible,
.reset-button:focus-visible {
  outline: 3px solid rgba(47, 107, 59, 0.22);
  outline-offset: 3px;
}

/* Right guide */

.guide-panel {
  background: linear-gradient(145deg, #f8fbf6, #ffffff);
}

.guide-number {
  background: #2f6b3b;
  color: #ffffff;
}

.guide-label {
  margin: 0 0 4px;
  color: #7aa66d;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.7px;
}

.guide-panel h4 {
  margin: 0;
  color: #2f6b3b;
  font-size: 23px;
}

.guide-intro {
  margin: 0 0 20px;
  padding-bottom: 20px;
  color: #566158;
  line-height: 1.65;
  border-bottom: 1px solid #e1e9df;
}

.guide-option-list {
  display: grid;
  gap: 12px;
}

.guide-option-card {
  padding: 17px 18px;
  background: #ffffff;
  border: 1px solid #dce6d9;
  border-radius: 12px;
  transition: 0.2s;
}

.guide-option-card:hover {
  border-color: #a9c2a4;
  box-shadow: 0 5px 14px rgba(47, 107, 59, 0.06);
}

.guide-option-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 7px;
}

.guide-option-title strong {
  color: #2f6b3b;
  font-size: 16px;
}

.guide-option-title span {
  color: #536157;
  font-size: 13px;
  font-weight: 600;
  text-align: right;
}

.guide-option-card p {
  margin: 0;
  color: #555f57;
  font-size: 14px;
  line-height: 1.6;
}

.guide-tip {
  margin-top: 18px;
  padding: 16px 18px;
  background: #eaf3e7;
  border-left: 4px solid #7eb36a;
  border-radius: 9px;
}

.guide-tip strong {
  display: block;
  margin-bottom: 4px;
  color: #2f6b3b;
}

.guide-tip p {
  margin: 0;
  color: #526056;
  font-size: 13px;
  line-height: 1.55;
}

/* Recommendation */

.recommendation-box {
  margin-top: 28px;
  padding: 25px 28px;
  background: #ffffff;
  border: 1px solid #dce6d9;
  border-left: 5px solid #7eb36a;
  border-radius: 14px;
}

.recommendation-box.error {
  border-left-color: #b42318;
}

.recommendation-label {
  margin: 0 0 8px;
  color: #6f9f75;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.8px;
}

.recommendation-box.error .recommendation-label {
  color: #b42318;
}

.recommendation-box h3 {
  margin: 0 0 10px;
  color: #2f6b3b;
  font-size: 23px;
}

.recommendation-box.error h3 {
  color: #b42318;
}

.recommendation-box > p:not(.recommendation-label) {
  margin-bottom: 0;
  color: #555;
  line-height: 1.7;
}

.recommendation-list {
  margin: 18px 0 0;
  padding-left: 22px;
  color: #555;
}

.recommendation-list li {
  margin-bottom: 8px;
  line-height: 1.6;
}
.guide-details summary {
  display: inline-block;

  color: #2f6b3b;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  text-decoration: underline;
  text-underline-offset: 3px;
}

.guide-details summary:focus-visible {
  outline: 3px solid #2f6b3b;
  outline-offset: 3px;
  border-radius: 4px;
}

.guide-item strong {
  display: block;

  margin-bottom: 4px;

  color: #2f6b3b;
}

.guide-item span {
  display: block;

  margin-bottom: 6px;

  color: #333;

  font-size: 13px;
  font-weight: 600;
}

.guide-item p {
  margin: 0;

  color: #4d4d4d;

  font-size: 13px;
  line-height: 1.5;
}

.space-example strong {
  display: block;

  margin-bottom: 4px;

  color: #2f6b3b;

  font-size: 14px;
}

.space-example span {
  display: block;

  margin-bottom: 5px;

  color: #333;

  font-size: 13px;

  font-weight: 600;
}

.space-example small {
  color: #4d4d4d;

  font-size: 12px;
  line-height: 1.4;
}

.condition-example strong {
  display: block;

  margin-bottom: 4px;

  color: #2f6b3b;

  font-size: 14px;
}

.condition-example span {
  display: block;

  margin-bottom: 5px;

  color: #333;

  font-size: 13px;

  font-weight: 600;
}

.condition-example small {
  color: #4d4d4d;

  font-size: 12px;
  line-height: 1.4;
}

.tree-page {
  width: 100%;

  background: #f7faf5;
}
/* =========================
   AI Recommendation
========================= */

.ai-recommendation {
  margin-top: 32px;

  padding: 30px;

  background: #ffffff;

  border: 1px solid #dce6d9;

  border-radius: 18px;
}

.ai-result-header {
  max-width: 760px;

  margin: 0 auto 26px;

  text-align: center;
}

.ai-tag {
  margin: 0 0 8px;

  color: #4f6f49;

  font-size: 12px;

  font-weight: 800;

  letter-spacing: 2px;
}

.ai-result-header h3 {
  margin: 0 0 12px;

  color: #2f6b3b;

  font-size: 27px;
}

.ai-result-header > p:not(.ai-tag) {
  margin: 0;

  color: #555;

  line-height: 1.7;
}

/* Plant Cards */

.ai-plant-grid {
  display: grid;

  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 18px;
}

.ai-plant-card {
  position: relative;

  padding: 24px;

  background: #f8fbf6;

  border: 1px solid #dce6d9;

  border-radius: 15px;
}

.plant-number {
  display: inline-block;

  margin-bottom: 13px;

  color: #7aa66d;

  font-size: 13px;

  font-weight: 800;

  letter-spacing: 2px;
}

.ai-plant-card h4 {
  margin: 0 0 4px;

  color: #2f6b3b;

  font-size: 21px;
}

.scientific-name {
  margin: 0 0 20px;

  color: #59645c;

  font-size: 14px;
}

.plant-detail {
  padding: 13px 0;

  border-top: 1px solid #dfe7dd;
}

.plant-detail strong {
  display: block;

  margin-bottom: 5px;

  color: #263c2b;

  font-size: 14px;
}

.plant-detail p {
  margin: 0;

  color: #555;

  font-size: 14px;

  line-height: 1.6;
}

/* Disclaimer */

.ai-disclaimer {
  margin-top: 22px;

  padding: 16px 18px;

  background: #eef5ee;

  border-left: 4px solid #7eb36a;

  border-radius: 9px;
}

.ai-disclaimer strong {
  display: block;

  margin-bottom: 4px;

  color: #2f6b3b;
}

.ai-disclaimer p {
  margin: 0;

  color: #4d4d4d;

  font-size: 13px;

  line-height: 1.6;
}

/* Error */

.ai-error {
  margin-top: 25px;

  padding: 15px 18px;

  color: #8f1c13;

  background: #fdecec;

  border: 1px solid #e5aaa6;

  border-left: 4px solid #b42318;

  border-radius: 9px;

  font-weight: 600;
}

/* Loading */

.recommend-button:disabled {
  opacity: 0.65;

  cursor: wait;

  transform: none;
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

.fallback-notice {
  margin: 15px auto 20px;
  padding: 12px 16px;

  max-width: 720px;

  color: #5c4a16;
  background: #fff8df;

  border: 1px solid #e2cf8a;
  border-radius: 8px;

  font-size: 14px;
  line-height: 1.5;
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

  .space-options {
    grid-template-columns: 1fr;
  }

  .condition-options {
    grid-template-columns: 1fr;
  }

  .guide-content {
    grid-template-columns: 1fr;
  }

  .selector-layout {
    grid-template-columns: 1fr;
  }

  .tree-selector {
    padding: 26px 18px;
  }

  .selector-panel,
  .guide-panel {
    padding: 22px 18px;
  }

  .selector-actions {
    flex-direction: column;
  }

  .recommend-button,
  .reset-button {
    width: 100%;
  }

  .field-heading {
    align-items: flex-start;
  }

  .guide-option-title {
    flex-direction: column;
    gap: 3px;
  }

  .guide-option-title span {
    text-align: left;
  }

  .ai-plant-grid {
    grid-template-columns: 1fr;
  }

  .ai-recommendation {
    padding: 22px 18px;
  }
}
</style>
