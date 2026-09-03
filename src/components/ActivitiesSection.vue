<template>
  <section class="activities-section" id="activities">
    <div class="section-header">
      <p class="section-tag">GET INVOLVED</p>

      <h2>Activities</h2>

      <div class="section-line"></div>

      <p class="section-description">
        Explore upcoming opportunities to connect with nature, support local communities, and take
        part in environmental action.
      </p>
    </div>

    <div class="activity-list">
      <div class="activity-card">
        <h3>Community Tree Planting</h3>

        <p class="activity-info"><strong>Date:</strong> 12 September 2026</p>

        <p class="activity-info"><strong>Location:</strong> Melbourne Community Park</p>

        <p>
          Join local residents to plant native trees and help improve Melbourne's urban environment.
        </p>

        <router-link to="/activities/tree-planting" class="activity-button">
          Learn More
        </router-link>
      </div>

      <div class="activity-card">
        <h3>Community Garden Day</h3>

        <p class="activity-info"><strong>Date:</strong> 20 September 2026</p>

        <p class="activity-info"><strong>Location:</strong> Local Community Garden</p>

        <p>
          Work together with community members to maintain shared green spaces and community
          gardens.
        </p>

        <router-link to="/activities/garden-day" class="activity-button"> Learn More </router-link>
      </div>

      <div class="activity-card">
        <h3>Biodiversity Walk</h3>

        <p class="activity-info"><strong>Date:</strong> 27 September 2026</p>

        <p class="activity-info"><strong>Location:</strong> Melbourne Nature Reserve</p>

        <p>
          Discover local plants and wildlife while learning about biodiversity in Melbourne's urban
          environment.
        </p>

        <router-link to="/activities/biodiversity-walk" class="activity-button">
          Learn More
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.activities-section {
  padding: 75px 40px;
  background: #eef5ee;
}

.section-header {
  text-align: center;
  margin-bottom: 46px;
}

.section-tag {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 3px;
  color: #668f61;
  text-transform: uppercase;
}

.section-header h2 {
  margin: 0;
  font-size: 52px;
  font-weight: 700;
  color: #2f6b3b;
  letter-spacing: -0.5px;
}

.section-line {
  width: 90px;
  height: 5px;
  margin: 16px auto 22px;
  background: #83b574;
  border-radius: 999px;
}

.section-description {
  max-width: 820px;
  margin: 0 auto;
  color: #455448;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.8;
}

.activities-section {
  padding: 70px 40px;
  background: #eef5ee;
}

.activities-section h2 {
  font-size: 32px;
  margin-bottom: 30px;
}

.activity-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.activity-card {
  padding: 28px;
  border: 1px solid #ddd;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);

  display: flex;
  flex-direction: column;
}

.activity-card h3 {
  font-size: 22px;
  margin-top: 0;
  color: #2f6b3b;
}

.activity-card p {
  line-height: 1.6;
  color: #444;
}

.activity-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.activity-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
}

.activity-info {
  margin: 5px 0;
}

.activity-button {
  display: inline-block;
  margin-top: auto;
  padding: 10px 18px;

  background: #2f6b3b;
  color: white;

  text-decoration: none;
  border-radius: 6px;

  align-self: flex-start;
}

.activity-button:hover {
  opacity: 0.85;
}

@media (max-width: 900px) {
  .activity-list {
    grid-template-columns: 1fr;
  }
}
</style>
