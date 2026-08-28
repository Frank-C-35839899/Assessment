import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import UrbanGreeningView from '../views/UrbanGreeningView.vue'
import TreePlantingView from '../views/TreePlantingView.vue'
import BiodiversityView from '../views/BiodiversityView.vue'
import AboutView from '../views/AboutView.vue'

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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
