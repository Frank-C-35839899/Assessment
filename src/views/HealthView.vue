<template>
  <div class="detail-page">
    <h1>Physical and Mental Health</h1>

    <p>
      Green spaces can encourage physical activity, provide opportunities for recreation, reduce
      stress, and support the overall wellbeing of people living in urban communities.
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
