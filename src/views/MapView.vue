<script setup>
import { ref, computed, onMounted } from 'vue'

import { setOptions, importLibrary } from '@googlemaps/js-api-loader'

/* =========================
   State
========================= */

const mapElement = ref(null)

const selectedLocation = ref(null)

const selectedActivity = ref('All')

const mapError = ref('')

const isLoadingMap = ref(true)

let map = null
let infoWindow = null
let markers = []

/* =========================
   Google Maps API Key
========================= */

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

/* =========================
   Melbourne Activity Data
========================= */

const locations = [
  {
    id: 1,

    name: 'Royal Botanic Gardens Melbourne',

    activity: 'Community Tree Planting',

    category: 'Tree Planting',

    address: 'Birdwood Avenue, Melbourne VIC 3004',

    description:
      'Join local volunteers to support tree planting and urban canopy improvement near Melbourne’s iconic botanical gardens.',

    lat: -37.8304,

    lng: 144.9796,
  },

  {
    id: 2,

    name: 'Fitzroy Gardens',

    activity: 'Community Garden Day',

    category: 'Community Garden',

    address: 'Wellington Parade, East Melbourne VIC 3002',

    description:
      'Take part in a community gardening activity focused on maintaining green spaces and encouraging local participation.',

    lat: -37.8124,

    lng: 144.9803,
  },

  {
    id: 3,

    name: 'Royal Park',

    activity: 'Biodiversity Walk',

    category: 'Biodiversity',

    address: 'Parkville VIC 3052',

    description:
      'Explore native plants, birds and urban wildlife while learning about biodiversity in one of Melbourne’s largest inner-city parks.',

    lat: -37.7905,

    lng: 144.9517,
  },
]

/* =========================
   Activity Categories
========================= */

const activityCategories = ['All', 'Tree Planting', 'Community Garden', 'Biodiversity']

/* =========================
   Filtered Locations
========================= */

const filteredLocations = computed(() => {
  if (selectedActivity.value === 'All') {
    return locations
  }

  return locations.filter((location) => location.category === selectedActivity.value)
})

/* =========================
   Initialise Google Map
========================= */

const initialiseMap = async () => {
  if (!googleMapsApiKey) {
    mapError.value = 'Google Maps API key is missing. Please check your .env file.'

    isLoadingMap.value = false

    return
  }

  try {
    setOptions({
      key: googleMapsApiKey,

      v: 'weekly',
    })

    const { Map, InfoWindow } = await importLibrary('maps')

    const melbourneCentre = {
      lat: -37.8136,
      lng: 144.9631,
    }

    map = new Map(mapElement.value, {
      center: melbourneCentre,

      zoom: 13,

      /*
            Advanced Marker requires
            a Map ID.
          */

      mapId: 'DEMO_MAP_ID',

      streetViewControl: false,

      mapTypeControl: false,

      fullscreenControl: true,
    })

    infoWindow = new InfoWindow()

    await createMarkers()

    isLoadingMap.value = false
  } catch (error) {
    console.error('Google Maps failed to load:', error)

    mapError.value = 'Unable to load Google Maps. Please check your API key and API restrictions.'

    isLoadingMap.value = false
  }
}

/* =========================
   Create Advanced Markers
========================= */

const createMarkers = async () => {
  if (!map) {
    return
  }

  /*
    Remove old markers
  */

  markers.forEach((marker) => {
    marker.map = null
  })

  markers = []

  /*
    Load marker library
  */

  const { AdvancedMarkerElement } = await importLibrary('marker')

  filteredLocations.value.forEach((location) => {
    const marker = new AdvancedMarkerElement({
      map,

      position: {
        lat: location.lat,

        lng: location.lng,
      },

      title: location.name,
    })

    /*
        Store our own location ID
        on the marker.

        This makes Show on Map
        easier later.
      */

    marker.locationId = location.id

    /*
        Advanced Marker click
      */

    marker.addEventListener('gmp-click', () => {
      selectLocation(location, marker)
    })

    markers.push(marker)
  })
}

/* =========================
   Select Location
========================= */

const selectLocation = (location, marker = null) => {
  selectedLocation.value = location

  if (!map) {
    return
  }

  map.panTo({
    lat: location.lat,

    lng: location.lng,
  })

  map.setZoom(15)

  if (marker && infoWindow) {
    infoWindow.setContent(`
      <div style="
        max-width: 240px;
        padding: 5px;
        font-family: Arial, sans-serif;
      ">

        <strong style="
          display: block;
          margin-bottom: 6px;
          color: #2f6b3b;
          font-size: 15px;
        ">
          ${location.name}
        </strong>

        <div style="
          margin-bottom: 5px;
          color: #333;
          font-size: 13px;
        ">
          ${location.activity}
        </div>

        <div style="
          color: #666;
          font-size: 12px;
          line-height: 1.5;
        ">
          ${location.address}
        </div>

      </div>
    `)

    infoWindow.open({
      map,
      anchor: marker,
    })
  }
}

/* =========================
   Show Location From Card
========================= */

const showLocationOnMap = (location) => {
  const marker = markers.find((item) => item.locationId === location.id)

  selectLocation(location, marker)

  /*
      Smoothly move user
      back to the map.
    */

  mapElement.value?.scrollIntoView({
    behavior: 'smooth',

    block: 'center',
  })
}

/* =========================
   Activity Filter
========================= */

const filterActivities = async (category) => {
  selectedActivity.value = category

  selectedLocation.value = null

  if (infoWindow) {
    infoWindow.close()
  }

  await createMarkers()

  /*
      Reset map view
    */

  if (map) {
    map.setCenter({
      lat: -37.8136,
      lng: 144.9631,
    })

    map.setZoom(13)
  }
}

/* =========================
   Reset Map
========================= */

const resetMap = async () => {
  selectedActivity.value = 'All'

  selectedLocation.value = null

  if (infoWindow) {
    infoWindow.close()
  }

  await createMarkers()

  if (map) {
    map.setCenter({
      lat: -37.8136,
      lng: 144.9631,
    })

    map.setZoom(13)
  }
}

/* =========================
   Get Directions
========================= */

const getDirections = (location) => {
  const destination = encodeURIComponent(`${location.name}, ${location.address}`)

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`

  window.open(directionsUrl, '_blank', 'noopener,noreferrer')
}

/* =========================
   Initialise
========================= */

onMounted(() => {
  initialiseMap()
})
</script>

<template>
  <main class="map-page">
    <!-- =========================
         Header
    ========================== -->

    <section class="page-header">
      <p class="page-tag">EXPLORE MELBOURNE</p>

      <h1>Urban Canopy Community Map</h1>

      <div class="title-line"></div>

      <p class="page-description">
        Discover Urban Canopy activities and green spaces across Melbourne. Select an activity type,
        explore locations on the map and get directions.
      </p>
    </section>

    <!-- =========================
         Activity Filters
    ========================== -->

    <section class="map-controls">
      <div class="filter-header">
        <div>
          <h2>Find an Activity</h2>

          <p>Filter locations by activity type.</p>
        </div>

        <button type="button" class="reset-button" @click="resetMap">Reset Map</button>
      </div>

      <div class="filter-buttons" aria-label="Activity filters">
        <button
          v-for="category in activityCategories"
          :key="category"
          type="button"
          class="filter-button"
          :class="{
            active: selectedActivity === category,
          }"
          @click="filterActivities(category)"
        >
          {{ category }}
        </button>
      </div>
    </section>

    <!-- =========================
         Google Map
    ========================== -->

    <section class="map-section">
      <div v-if="isLoadingMap" class="map-loading">Loading Google Maps...</div>

      <div v-if="mapError" class="map-error">
        {{ mapError }}
      </div>

      <div ref="mapElement" class="google-map" aria-label="Urban Canopy activity map"></div>
    </section>

    <!-- =========================
         Selected Location
    ========================== -->

    <section v-if="selectedLocation" class="selected-location">
      <div class="selected-content">
        <p class="location-category">
          {{ selectedLocation.category }}
        </p>

        <h2>
          {{ selectedLocation.name }}
        </h2>

        <h3>
          {{ selectedLocation.activity }}
        </h3>

        <p class="location-address">
          📍
          {{ selectedLocation.address }}
        </p>

        <p class="location-description">
          {{ selectedLocation.description }}
        </p>

        <button type="button" class="directions-button" @click="getDirections(selectedLocation)">
          Get Directions
        </button>
      </div>
    </section>

    <!-- =========================
         Activity Cards
    ========================== -->

    <section class="locations-section">
      <div class="locations-heading">
        <p class="page-tag">COMMUNITY LOCATIONS</p>

        <h2>Explore Activities</h2>

        <p>
          {{ filteredLocations.length }}

          location<span v-if="filteredLocations.length !== 1"> s </span>

          available
        </p>
      </div>

      <div class="location-grid">
        <article v-for="location in filteredLocations" :key="location.id" class="location-card">
          <div class="card-top">
            <span class="category-badge">
              {{ location.category }}
            </span>
          </div>

          <h3>
            {{ location.name }}
          </h3>

          <p class="activity-name">
            {{ location.activity }}
          </p>

          <p class="card-address">
            {{ location.address }}
          </p>

          <p class="card-description">
            {{ location.description }}
          </p>

          <div class="card-actions">
            <button type="button" class="map-button" @click="showLocationOnMap(location)">
              Show on Map
            </button>

            <button type="button" class="card-directions-button" @click="getDirections(location)">
              Get Directions
            </button>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.map-page {
  min-height: 100vh;

  padding: 70px 30px 80px;

  background: #f7faf5;
}

/* =========================
   Header
========================= */

.page-header {
  max-width: 850px;

  margin: 0 auto 45px;

  text-align: center;
}

.page-tag {
  margin: 0 0 10px;

  color: #7aa66d;

  font-size: 13px;

  font-weight: 700;

  letter-spacing: 3px;
}

.page-header h1 {
  margin: 0;

  color: #2f6b3b;

  font-size: 48px;

  line-height: 1.15;
}

.title-line {
  width: 70px;

  height: 4px;

  margin: 16px auto 20px;

  background: #8fbe7f;

  border-radius: 10px;
}

.page-description {
  margin: 0;

  color: #555;

  font-size: 17px;

  line-height: 1.75;
}

/* =========================
   Controls
========================= */

.map-controls {
  max-width: 1300px;

  margin: 0 auto 24px;

  padding: 24px;

  background: white;

  border: 1px solid #e3e8e1;

  border-radius: 16px;

  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.04);
}

.filter-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 20px;
}

.filter-header h2 {
  margin: 0 0 4px;

  color: #2f6b3b;
}

.filter-header p {
  margin: 0;

  color: #666;
}

.filter-buttons {
  display: flex;

  flex-wrap: wrap;

  gap: 10px;
}

.filter-button,
.reset-button {
  padding: 10px 16px;

  border-radius: 8px;

  font-family: inherit;

  font-size: 14px;

  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;
}

.filter-button {
  background: white;

  color: #2f6b3b;

  border: 1px solid #aac2a5;
}

.filter-button:hover {
  background: #eef5ee;
}

.filter-button.active {
  background: #2f6b3b;

  color: white;

  border-color: #2f6b3b;
}

.reset-button {
  background: #eef5ee;

  color: #2f6b3b;

  border: 1px solid #b9cdb5;
}

.reset-button:hover {
  background: #e1ecdf;
}

/* =========================
   Map
========================= */

.map-section {
  position: relative;

  max-width: 1300px;

  margin: 0 auto 30px;

  overflow: hidden;

  background: white;

  border: 1px solid #dfe6dd;

  border-radius: 18px;

  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.07);
}

.google-map {
  width: 100%;

  height: 560px;
}

.map-loading {
  position: absolute;

  z-index: 5;

  top: 20px;

  left: 50%;

  transform: translateX(-50%);

  padding: 10px 18px;

  background: white;

  color: #2f6b3b;

  border-radius: 20px;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  font-weight: 700;
}

.map-error {
  padding: 18px;

  color: #b42318;

  background: #fdecec;

  border-bottom: 1px solid #f3c7c4;
}

/* =========================
   Selected Location
========================= */

.selected-location {
  max-width: 1300px;

  margin: 0 auto 45px;
}

.selected-content {
  padding: 28px;

  background: #eef5ee;

  border: 1px solid #cdddc9;

  border-left: 5px solid #2f6b3b;

  border-radius: 14px;
}

.location-category {
  margin: 0 0 8px;

  color: #6e9b64;

  font-size: 12px;

  font-weight: 800;

  letter-spacing: 1.5px;

  text-transform: uppercase;
}

.selected-content h2 {
  margin: 0 0 6px;

  color: #2f6b3b;
}

.selected-content h3 {
  margin: 0 0 16px;

  color: #333;

  font-size: 17px;
}

.location-address {
  margin: 0 0 14px;

  color: #555;
}

.location-description {
  max-width: 850px;

  color: #555;

  line-height: 1.7;
}

.directions-button {
  margin-top: 8px;

  padding: 11px 20px;

  background: #2f6b3b;

  color: white;

  border: none;

  border-radius: 8px;

  font-family: inherit;

  font-weight: 700;

  cursor: pointer;
}

.directions-button:hover {
  background: #25552f;
}

/* =========================
   Cards
========================= */

.locations-section {
  max-width: 1300px;

  margin: 0 auto;
}

.locations-heading {
  margin-bottom: 25px;

  text-align: center;
}

.locations-heading h2 {
  margin: 0 0 8px;

  color: #2f6b3b;

  font-size: 34px;
}

.locations-heading p:last-child {
  margin: 0;

  color: #666;
}

.location-grid {
  display: grid;

  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 22px;
}

.location-card {
  display: flex;

  flex-direction: column;

  padding: 24px;

  background: white;

  border: 1px solid #e1e7df;

  border-radius: 16px;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);

  transition: 0.2s;
}

.location-card:hover {
  transform: translateY(-4px);

  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

.card-top {
  margin-bottom: 15px;
}

.category-badge {
  display: inline-block;

  padding: 6px 10px;

  background: #eef5ee;

  color: #2f6b3b;

  border-radius: 20px;

  font-size: 12px;

  font-weight: 700;
}

.location-card h3 {
  margin: 0 0 8px;

  color: #253b2a;

  font-size: 20px;
}

.activity-name {
  margin: 0 0 12px;

  color: #2f6b3b;

  font-weight: 700;
}

.card-address {
  margin: 0 0 12px;

  color: #777;

  font-size: 14px;
}

.card-description {
  flex: 1;

  margin: 0 0 22px;

  color: #555;

  font-size: 14px;

  line-height: 1.65;
}

.card-actions {
  display: flex;

  gap: 10px;

  flex-wrap: wrap;
}

.map-button,
.card-directions-button {
  padding: 10px 14px;

  border-radius: 7px;

  font-family: inherit;

  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;
}

.map-button {
  background: #2f6b3b;

  color: white;

  border: 1px solid #2f6b3b;
}

.map-button:hover {
  background: #25552f;
}

.card-directions-button {
  background: white;

  color: #2f6b3b;

  border: 1px solid #aac2a5;
}

.card-directions-button:hover {
  background: #eef5ee;
}

/* =========================
   Tablet
========================= */

@media (max-width: 950px) {
  .location-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* =========================
   Mobile
========================= */

@media (max-width: 650px) {
  .map-page {
    padding: 45px 16px 60px;
  }

  .page-header h1 {
    font-size: 35px;
  }

  .page-description {
    font-size: 15px;
  }

  .filter-header {
    flex-direction: column;

    align-items: stretch;
  }

  .reset-button {
    width: 100%;
  }

  .filter-buttons {
    display: grid;

    grid-template-columns: 1fr 1fr;
  }

  .google-map {
    height: 430px;
  }

  .location-grid {
    grid-template-columns: 1fr;
  }

  .card-actions {
    flex-direction: column;
  }

  .map-button,
  .card-directions-button {
    width: 100%;
  }
}
</style>
