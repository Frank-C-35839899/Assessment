<script setup>
import ImportanceSection from '../components/ImportanceSection.vue'
import ActivitiesSection from '../components/ActivitiesSection.vue'
import VolunteerSection from '../components/VolunteerSection.vue'
</script>

<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>Greener Melbourne, Stronger Communities</h1>

        <p>
          Discover urban greening, tree planting, biodiversity, and ways to get involved in creating
          a greener Melbourne.
        </p>

        <a href="#activities" class="hero-button"> Explore Activities </a>
      </div>
    </section>

    <ImportanceSection />
    <ActivitiesSection />
    <VolunteerSection />
  </div>
</template>

<style scoped>
.hero-section {
  min-height: 460px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 30px;

  background:
    linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('../assets/FIT5032 A1.jpg');

  background-size: cover;
  background-position: center;
}

.hero-content {
  max-width: 800px;
  color: white;
}

.hero-content h1 {
  font-size: 48px;
  margin-bottom: 20px;
}

.hero-content p {
  font-size: 20px;
  line-height: 1.6;
  margin-bottom: 30px;
}

.hero-button {
  display: inline-block;
  padding: 12px 24px;
  background-color: #2f6b3b;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
}

.hero-button:hover {
  opacity: 0.85;
}

@media (max-width: 768px) {
  .hero-section {
    width: 100%;
    max-width: 100%;
    min-height: 480px;

    padding: 40px 20px;

    display: flex;
    align-items: center;
    justify-content: center;

    background-position: center;
    background-size: cover;

    overflow: hidden;
  }

  .hero-content {
    width: 100%;
    max-width: 360px;

    margin: 0 auto;
    padding: 0;

    text-align: center;
  }

  .hero-content h1 {
    width: 100%;
    margin: 0 0 20px;

    font-size: 32px;
    line-height: 1.15;

    white-space: normal;
    overflow-wrap: normal;
  }

  .hero-content p {
    width: 100%;
    max-width: 330px;

    margin: 0 auto 25px;

    font-size: 16px;
    line-height: 1.6;
  }

  .hero-button {
    display: inline-block;

    padding: 11px 20px;

    font-size: 15px;
  }
}
</style>
