<template>
  <div class="layout">
    <Header007/>
    <main class="bond-main">
      <FilmsCarousel />
      <ActorsCarousel />
    </main>
    <Footer007/>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout > *:last-child {
  margin-top: auto;
}


.bond-main {
  flex: 1;
  background: linear-gradient(180deg, #000 0%, #1a1a1a 100%);
  color: gold;
  font-family: 'Cinzel', serif;
  padding: 40px 20px;
  border-top: 2px solid gold;
  border-bottom: 2px solid gold;
}
</style>

<script setup>
import Header007 from "./components/Header007.vue"; 
import FilmsCarousel from "./components/FilmsCarousel.vue";
import ActorsCarousel from "./components/ActorsCarousel.vue";
import Footer007 from "./components/Footer007.vue";
</script>