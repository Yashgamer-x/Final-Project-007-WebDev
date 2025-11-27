<!-- HTML -->
<template>
<div id="films">
    <h1 class="text-align-center">Films</h1>

    <div class="carousel-wrapper">
        <button class="arrow left"
        v-if="showArrows"
        @click="scrollLeft"
        >&lt;</button>

        <div class="carousel" ref="carousel">
        <div
            v-for="(film, index) in films"
            :key="index"
            class="carousel-item"
        >
            <img :src="film.imageurl" :alt="film.name" />
            <p>{{ film.name }}</p>
        </div>
        </div>

        <button class="arrow right"
        v-if="showArrows"
        @click="scrollRight"
        >&gt;</button>
    </div>
    <div class="add-film-wrapper">
        <button class="add-film-btn">Add Film</button>
    </div>
</div>
</template>

<!-- JavaScript -->
<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const films = ref([]);
const carousel = ref(null);
const showArrows = ref(false);

function checkOverflow() {
    if (!carousel.value) return;
    showArrows.value = carousel.value.scrollWidth > carousel.value.clientWidth;
}

function scrollLeft() {
    carousel.value.scrollBy({ left: -220, behavior: "smooth" });
}

function scrollRight() {
    carousel.value.scrollBy({ left: 220, behavior: "smooth" });
}

onMounted(async () => {
    const res = await fetch("http://localhost:3000/api/films");
    films.value = await res.json();
    setTimeout(checkOverflow);
    window.addEventListener('resize', checkOverflow);
});

onUnmounted( async () => {
    window.removeEventListener('resize', checkOverflow);
});
</script>

<!-- CSS -->
<style scoped>
.text-align-center {
    text-align: center;
}

.carousel-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    overflow: hidden;
    margin: 0 auto;
}

.carousel {
    display: flex;
    overflow-x: auto;
    gap: 20px;
    padding: 10px;
    scroll-behavior: smooth;
    max-width: 100%;
    scrollbar-width: none; 
}

.carousel-item {
    flex: 0 0 auto;
    width: 200px;
    text-align: center;
    background: #111;
    border: 2px solid gold;
    border-radius: 8px;
    padding: 10px;
    color: gold;
    font-family: 'Cinzel', serif;
    transition: transform 0.3s ease;
}

.carousel-item:hover {
    transform: scale(1.05);
}

.carousel-item img {
    width: 100%;
    height: auto;
    border-radius: 6px;
}

.arrow {
    background: gold;
    border: none;
    color: black;
    font-size: 32px;
    padding: 5px 10px;
    cursor: pointer;
    transition: background 0.3s;
    z-index: 10;
}

.arrow:hover {
    background: white;
}

.add-film-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.add-film-btn {
    background: black;
    color: gold;
    font-family: 'Cinzel', serif;
    font-size: 21px;
    font-weight: bold;
    border: 2px solid gold;
    border-radius: 8px;
    padding: 10px 20px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.add-film-btn:hover {
    background: gold;
    color: black;
    transform: scale(1.05);
    box-shadow: 0 0 10px gold;
}


img[src$=".svg"] {
    filter: invert(1) brightness(2);
}
</style>
