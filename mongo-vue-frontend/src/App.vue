<template>
  <div class="layout">
    <Header007/>
    <main>
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

</style>

<script setup>
import Header007 from "./components/Header007.vue"; 
import FilmsCarousel from "./components/FilmsCarousel.vue";
import ActorsCarousel from "./components/ActorsCarosuel.vue";
import Footer007 from "./components/Footer007.vue";
</script>
