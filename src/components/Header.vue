<script setup>
import { ref } from 'vue'
import logo from '../assets/header-logo.png'

const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}
</script>

<template>
  <header class="site-header">
    <!-- Logo / Brand -->
    <router-link to="/" class="brand" @click="closeMenu">
      <img :src="logo" alt="Green Melbourne logo" class="brand-logo" />

      <div class="brand-text">
        <div class="brand-name">Green Melbourne</div>

        <div class="brand-tagline">GREENER · HEALTHIER · TOGETHER</div>
      </div>
    </router-link>

    <!-- Hamburger Button -->
    <button class="menu-button" @click="toggleMenu" aria-label="Open navigation menu">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Dropdown Menu -->
    <nav v-if="menuOpen" class="menu">
      <router-link to="/" @click="closeMenu"> Home </router-link>

      <router-link to="/urban-greening" @click="closeMenu"> Urban Greening </router-link>

      <router-link to="/tree-planting" @click="closeMenu"> Tree Planting </router-link>

      <router-link to="/biodiversity" @click="closeMenu"> Biodiversity </router-link>

      <router-link to="/about" @click="closeMenu"> About Us </router-link>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 16px 45px;

  background: rgba(255, 255, 255, 0.96);

  border-bottom: 1px solid #e7ece5;

  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);

  z-index: 1000;
}

.brand {
  display: flex;
  align-items: center;

  gap: 14px;

  text-decoration: none;
}

.brand-logo {
  width: 70px;
  height: 70px;

  object-fit: contain;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 30px;
  font-weight: 700;

  color: #1f6337;

  letter-spacing: 0.3px;
}

.brand-tagline {
  margin-top: 3px;

  font-size: 11px;
  font-weight: 600;

  color: #64816c;

  letter-spacing: 2px;
}

.menu-button {
  width: 48px;
  height: 48px;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  gap: 6px;

  background: #eef5ee;

  border: none;
  border-radius: 50%;

  cursor: pointer;

  transition: 0.2s;
}

.menu-button span {
  width: 23px;
  height: 2px;

  background: #265d36;

  border-radius: 2px;
}

.menu-button:hover {
  background: #dfeedd;
}

.menu {
  position: absolute;

  top: 90px;
  right: 45px;

  width: 230px;

  display: flex;
  flex-direction: column;

  padding: 12px;

  background: white;

  border: 1px solid #e2e8df;
  border-radius: 14px;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.menu a {
  padding: 13px 16px;

  color: #333;

  text-decoration: none;

  border-radius: 8px;

  font-size: 16px;

  transition: 0.2s;
}

.menu a:hover {
  background: #eef5ee;

  color: #2f6b3b;
}

.menu a.router-link-active {
  background: #e2f1df;

  color: #2f6b3b;

  font-weight: 600;
}

@media (max-width: 650px) {
  .site-header {
    width: 100%;
    max-width: 100%;

    padding: 10px 14px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    overflow: visible;
  }

  .brand {
    min-width: 0;
    flex: 1;

    display: flex;
    align-items: center;

    gap: 7px;
  }

  .brand-logo {
    width: 42px;
    height: 42px;

    flex-shrink: 0;
  }

  .brand-name {
    font-size: 19px;
    white-space: nowrap;
  }

  .brand-tagline {
    display: none;
  }

  .menu-button {
    width: 40px;
    height: 40px;

    flex-shrink: 0;
  }

  .menu {
    top: 66px;
    right: 14px;
    width: 200px;
  }
}
</style>
