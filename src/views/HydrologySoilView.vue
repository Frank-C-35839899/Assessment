<template>
  <div class="detail-page">
    <h1>Hydrology and Soil</h1>

    <p>
      Urban greening helps improve soil quality, reduce surface runoff, support water infiltration,
      and improve water management in urban areas.
    </p>

    <router-link to="/" class="back-link"> Back to Home </router-link>
  </div>
</template>

<style scoped>
.detail-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 30px;
}

.detail-page h1 {
  margin-bottom: 24px;
}

.detail-page p {
  font-size: 18px;
  line-height: 1.7;
}

.back-link {
  display: inline-block;
  margin-top: 30px;
  text-decoration: none;
  font-weight: bold;
}
</style>
