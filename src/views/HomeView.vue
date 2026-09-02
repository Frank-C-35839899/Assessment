<script setup>
import ImportanceSection from '../components/ImportanceSection.vue'
import ActivitiesSection from '../components/ActivitiesSection.vue'
import VolunteerSection from '../components/VolunteerSection.vue'
</script>

<template>
  <div class="home-page">
    <h1>Home</h1>

    <ImportanceSection />
    <ActivitiesSection />
    <VolunteerSection />
  </div>
</template>

<style scoped>
.home-page {
  padding-top: 20px;
}
</style>
