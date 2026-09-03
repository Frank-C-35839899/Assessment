<template>
  <section class="volunteer-section">
    <div class="volunteer-content">
      <div class="section-header">
        <p class="section-tag">JOIN THE COMMUNITY</p>

        <h2>Volunteer Zone</h2>

        <div class="section-line"></div>

        <p class="section-description">
          Give your time, meet like-minded people, and help create greener, healthier, and more
          biodiverse communities across Melbourne.
        </p>
      </div>

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
.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-tag {
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 3px;
  color: #edf5ec;
}

.section-header h2 {
  margin: 0;
  font-size: 48px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #ffffff;
}

.section-description {
  max-width: 760px;
  margin: 0 auto;
  color: #f7faf6;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.7;
}

.section-line {
  width: 65px;
  height: 4px;
  margin: 14px auto 16px;
  background: #cfe4c9;
  border-radius: 10px;
}

.volunteer-section {
  padding: 75px 40px;
  background: linear-gradient(135deg, #5f9470, #8fc29b);
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
  padding: 28px;
  background: rgba(255, 255, 255, 0.96);
  color: #333;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.volunteer-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
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
  padding: 14px 28px;

  background: white;
  color: #2f6b3b;

  text-decoration: none;
  font-weight: 700;

  border-radius: 8px;

  transition: 0.2s ease;
}

.volunteer-button:hover {
  background: #eaf4e8;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .volunteer-cards {
    grid-template-columns: 1fr;
  }
}
</style>
