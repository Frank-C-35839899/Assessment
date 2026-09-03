<template>
  <section class="volunteer-section">
    <div class="volunteer-content">
      <h2>Volunteer Zone</h2>

      <p class="intro">
        Join our community and help create greener, healthier, and more biodiverse neighbourhoods
        across Melbourne.
      </p>

      <div class="volunteer-cards">
        <div class="volunteer-card">
          <h3>Why Volunteer?</h3>
          <p>
            Make a direct contribution to urban greening, biodiversity conservation, and community
            wellbeing.
          </p>
        </div>

        <div class="volunteer-card">
          <h3>What You Can Do</h3>
          <p>
            Take part in tree planting, community gardening, biodiversity walks, and other local
            environmental activities.
          </p>
        </div>

        <div class="volunteer-card">
          <h3>Who Can Join?</h3>
          <p>
            Anyone interested in helping the environment can participate. No professional experience
            is required.
          </p>
        </div>
      </div>

      <router-link to="/volunteer-registration" class="volunteer-button">
        Become a Volunteer
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.volunteer-section {
  padding: 70px 40px;
  background: #2f6b3b;
  color: white;
}

.volunteer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.volunteer-content h2 {
  font-size: 36px;
  margin-bottom: 16px;
}

.intro {
  max-width: 750px;
  margin: 0 auto 40px;
  font-size: 18px;
  line-height: 1.7;
}

.volunteer-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.volunteer-card {
  padding: 26px;
  background: white;
  color: #333;
  border-radius: 14px;
}

.volunteer-card h3 {
  color: #2f6b3b;
  margin-top: 0;
}

.volunteer-card p {
  line-height: 1.6;
}

.volunteer-button {
  display: inline-block;
  padding: 14px 26px;
  background: white;
  color: #2f6b3b;
  text-decoration: none;
  font-weight: bold;
  border-radius: 7px;
}

.volunteer-button:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .volunteer-cards {
    grid-template-columns: 1fr;
  }
}
</style>
