<template>
  <header class="site-header">
    <div class="logo">Urban Canopy</div>

    <nav class="nav-links">
      <router-link to="/">Home</router-link>
      <router-link to="/urban-greening">Urban Greening</router-link>
      <router-link to="/tree-planting">Tree Planting</router-link>
      <router-link to="/biodiversity">Biodiversity</router-link>
      <router-link to="/about">About Us</router-link>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
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

.nav-links {
  display: flex;
  gap: 28px;
}

.nav-links a {
  text-decoration: none;
  color: #222;
  font-size: 18px;
}

.nav-links a.router-link-active {
  font-weight: bold;
}
</style>
