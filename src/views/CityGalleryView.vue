<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const cityData = {
  singapore: {
    name: 'Singapore',
    description:
      'Explore examples of how Singapore integrates vegetation, green architecture and public green spaces into its urban environment.',
  },

  copenhagen: {
    name: 'Copenhagen',
    description:
      'Explore examples of Copenhagen’s green public spaces, sustainable urban planning and environmentally friendly city design.',
  },

  vancouver: {
    name: 'Vancouver',
    description:
      'Explore examples of Vancouver’s connection between natural landscapes, urban parks and sustainable development.',
  },

  melbourne: {
    name: 'Melbourne',
    description:
      'Explore examples of Melbourne’s urban forests, green spaces and community greening initiatives.',
  },
}

const city = computed(() => {
  return cityData[route.params.city]
})
</script>

<template>
  <div class="gallery-page">
    <div v-if="city" class="gallery-container">
      <div class="gallery-header">
        <p class="page-tag">CITY GALLERY</p>

        <h1>{{ city.name }} Urban Greening</h1>

        <div class="title-line"></div>

        <p>
          {{ city.description }}
        </p>
      </div>

      <div class="gallery-grid">
        <div class="image-placeholder">{{ city.name }} Image 1</div>

        <div class="image-placeholder">{{ city.name }} Image 2</div>

        <div class="image-placeholder">{{ city.name }} Image 3</div>
      </div>

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

.gallery-grid {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 22px;
}

.image-placeholder {
  height: 250px;

  display: flex;

  align-items: center;
  justify-content: center;

  background: linear-gradient(135deg, #6fa37b, #9bc9a5);

  border-radius: 16px;

  color: white;

  font-size: 20px;
  font-weight: 700;
}

.back-button {
  display: inline-block;

  margin-top: 40px;

  padding: 12px 22px;

  background: #2f6b3b;

  color: white;

  text-decoration: none;

  border-radius: 8px;

  font-weight: 700;
}

.back-button:hover {
  background: #25552f;
}

@media (max-width: 768px) {
  .gallery-header h1 {
    font-size: 36px;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .image-placeholder {
    height: 220px;
  }
}
</style>
