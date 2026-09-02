<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
</script>

<template>
  <header class="site-header">
    <div class="logo">Green Melbourne</div>

    <button class="menu-button" @click="toggleMenu">☰</button>

    <nav v-if="menuOpen" class="menu">
      <router-link to="/" @click="menuOpen = false"> Home </router-link>

      <router-link to="/urban-greening" @click="menuOpen = false"> Urban Greening </router-link>

      <router-link to="/tree-planting" @click="menuOpen = false"> Tree Planting </router-link>

      <router-link to="/biodiversity" @click="menuOpen = false"> Biodiversity </router-link>

      <router-link to="/about" @click="menuOpen = false"> About Us </router-link>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  border-bottom: 1px solid #ddd;
}

.logo {
  font-size: 28px;
  font-weight: bold;
}

.menu-button {
  font-size: 30px;
  background: none;
  border: none;
  cursor: pointer;
}

.menu {
  position: absolute;
  top: 75px;
  right: 40px;
  display: flex;
  flex-direction: column;
  width: 220px;
  padding: 15px;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.menu a {
  padding: 12px;
  text-decoration: none;
  color: #222;
}

.menu a:hover {
  background: #f2f2f2;
}

.menu a.router-link-active {
  font-weight: bold;
}
</style>
