import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import UrbanGreeningView from '../views/UrbanGreeningView.vue'
import TreePlantingView from '../views/TreePlantingView.vue'
import BiodiversityView from '../views/BiodiversityView.vue'
import AboutView from '../views/AboutView.vue'
import HydrologySoilView from '../views/HydrologySoilView.vue'
import HealthView from '../views/HealthView.vue'
import TreePlantingActivityView from '../views/TreePlantingActivityView.vue'
import GardenDayView from '../views/GardenDayView.vue'
import BiodiversityWalkView from '../views/BiodiversityWalkView.vue'
import VolunteerRegistrationView from '../views/VolunteerRegistrationView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import AdminView from '../views/AdminView.vue'
import RatingView from '../views/RatingView.vue'

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
  {
    path: '/activities/tree-planting',
    name: 'TreePlantingActivity',
    component: TreePlantingActivityView,
  },
  {
    path: '/activities/garden-day',
    name: 'GardenDay',
    component: GardenDayView,
  },
  {
    path: '/activities/biodiversity-walk',
    name: 'BiodiversityWalk',
    component: BiodiversityWalkView,
  },
  {
    path: '/volunteer-registration',
    name: 'VolunteerRegistration',
    component: VolunteerRegistrationView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: {
      requiresAdmin: true,
    },
  },
  {
    path: '/rating',
    name: 'Rating',
    component: RatingView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))

  if (to.meta.requiresAdmin) {
    if (!currentUser) {
      return '/login'
    }

    if (currentUser.role !== 'admin') {
      return '/'
    }
  }
})

export default router
