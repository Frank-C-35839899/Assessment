import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import UrbanGreeningView from '../views/UrbanGreeningView.vue'
import TreePlantingView from '../views/TreePlantingView.vue'
import BiodiversityView from '../views/BiodiversityView.vue'
import AboutView from '../views/AboutView.vue'
import HydrologySoilView from '../views/HydrologySoilView.vue'
import HealthView from '../views/HealthView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/urban-greening',
    name: 'UrbanGreening',
    component: UrbanGreeningView,
  },
  {
    path: '/tree-planting',
    name: 'TreePlanting',
    component: TreePlantingView,
  },
  {
    path: '/biodiversity',
    name: 'Biodiversity',
    component: BiodiversityView,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
  },
  {
    path: '/importance/hydrology-soil',
    name: 'HydrologySoil',
    component: HydrologySoilView,
  },
  {
    path: '/importance/health',
    name: 'Health',
    component: HealthView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
