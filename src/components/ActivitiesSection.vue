<template>
  <section class="activities-section" id="activities">
    <h2>Activities</h2>

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
  padding: 60px 40px;
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
