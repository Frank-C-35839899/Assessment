<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import singapore1 from '../assets/Singapore1.png'
import singapore2 from '../assets/Singapore2.png'
import singapore3 from '../assets/Singapore3.png'

const route = useRoute()

const cityData = {
  singapore: {
    name: 'Singapore',

    description:
      'Explore examples of how Singapore integrates vegetation, green architecture and public green spaces into its urban environment.',

    images: [singapore1, singapore2, singapore3],
  },

  copenhagen: {
    name: 'Copenhagen',

    description:
      'Explore examples of Copenhagen’s green public spaces, sustainable urban planning and environmentally friendly city design.',

    images: [],
  },

  vancouver: {
    name: 'Vancouver',

    description:
      'Explore examples of Vancouver’s connection between natural landscapes, urban parks and sustainable development.',

    images: [],
  },

  melbourne: {
    name: 'Melbourne',

    description:
      'Explore examples of Melbourne’s urban forests, green spaces and community greening initiatives.',

    images: [],
  },
}

const city = computed(() => {
  return cityData[route.params.city]
})
</script>

<template>
  <div class="gallery-page">
    <div v-if="city" class="gallery-container">
      <!-- Header -->
      <div class="gallery-header">
        <p class="page-tag">CITY GALLERY</p>

        <h1>{{ city.name }} Urban Greening</h1>

        <div class="title-line"></div>

        <p>
          {{ city.description }}
        </p>
      </div>

      <!-- Images -->
      <div v-if="city.images.length > 0" class="gallery-grid">
        <img
          v-for="(image, index) in city.images"
          :key="index"
          :src="image"
          :alt="`${city.name} urban greening image ${index + 1}`"
          class="gallery-image"
        />
      </div>

      <!-- Temporary message for cities without images -->
      <div v-else class="empty-gallery">Images for {{ city.name }} will be added soon.</div>

      <!-- Back Button -->
      <router-link to="/urban-greening" class="back-button"> ← Back to Urban Greening </router-link>
    </div>
  </div>
</template>

<style scoped>
.gallery-page {
  min-height: 100vh;

  padding: 70px 20px;

  background: #f7faf5;
}

.gallery-container {
  max-width: 1100px;

  margin: 0 auto;
}

/* Header */

.gallery-header {
  max-width: 800px;

  margin: 0 auto 45px;

  text-align: center;
}

.page-tag {
  margin-bottom: 10px;

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 3px;

  color: #7aa66d;
}

.gallery-header h1 {
  margin: 0;

  font-size: 48px;

  color: #2f6b3b;
}

.title-line {
  width: 80px;
  height: 4px;

  margin: 16px auto 22px;

  background: #8fbe7f;

  border-radius: 10px;
}

.gallery-header p {
  color: #555;

  line-height: 1.8;

  font-size: 17px;
}

/* Gallery */

.gallery-grid {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 22px;
}

.gallery-image {
  width: 100%;

  height: 260px;

  object-fit: cover;

  border-radius: 16px;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);

  transition: 0.25s;
}

.gallery-image:hover {
  transform: scale(1.02);

  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
}

/* Empty gallery */

.empty-gallery {
  padding: 50px 20px;

  text-align: center;

  background: white;

  border: 1px solid #e4ebe1;

  border-radius: 16px;

  color: #777;
}

/* Back button */

.back-button {
  display: inline-block;

  margin-top: 40px;

  padding: 12px 22px;

  background: #2f6b3b;

  color: white;

  text-decoration: none;

  border-radius: 8px;

  font-weight: 700;

  transition: 0.2s;
}

.back-button:hover {
  background: #25552f;

  transform: translateY(-2px);
}

/* Responsive */

@media (max-width: 768px) {
  .gallery-page {
    padding: 50px 16px;
  }

  .gallery-header h1 {
    font-size: 36px;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .gallery-image {
    height: 240px;
  }
}
</style>
