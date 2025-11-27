<!-- HTML -->
<template>
<div id="films">
    <h1 class="text-align-center">Films</h1>

    <div class="carousel-wrapper">
        <button class="arrow"
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

        <button class="arrow"
        v-if="showArrows"
        @click="scrollRight"
        >&gt;</button>
    </div>
    <div class="add-film-wrapper">
        <button class="add-film-btn"
        @click="openFilmModal">Add Film</button>
    </div>
    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div style="position: relative;" class="modal-content">
        <button class="close-btn" 
        @click="closeFilmModal"
        style="position: absolute; left: 10px; top: 0;">Close</button>
        <h2>Add Film</h2>
        <div class="form-scroll">
            <form @submit.prevent="submitFilm">
                <fieldset>
                    <legend>Title</legend>
                    <input type="text" 
                    v-model="film.title"
                    placeholder="No Time to Die" 
                    required />
                </fieldset>
                <fieldset>
                    <legend>Description</legend>
                    <textarea 
                        v-model="film.description" 
                        placeholder="Type the description here" 
                        required
                    ></textarea>
                </fieldset>
                <fieldset>
                    <legend>Date</legend>
                    <input type="date"
                    v-model="film.releaseDate" 
                    required />
                </fieldset>
                <fieldset>
                    <legend>Image URL</legend>
                    <input 
                    type="url" 
                    v-model="film.imageUrl"
                    placeholder="https://example.com/notime.jpg" 
                    required 
                    />
                </fieldset>
                <div v-for="(actor, index) in actors" 
                :key="index">
                    <fieldset>
                        <legend>Actor {{ index + 1 }}</legend>
                        <input 
                        type="text" 
                        v-model="actors[index]" 
                        :id="'actor' + index" 
                        required 
                        />
                    </fieldset>
                </div>
                <button type="button" 
                class="close-btn"
                @click="addActor">Add Actor</button>
                <br><br>
                <button type="submit" 
                class="add-film-btn">Submit Film</button>
            </form>
        </div>
      </div>
    </div>
</div>
</template>

<!-- JavaScript -->
<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const films = ref([]);
const carousel = ref(null);
const showArrows = ref(false);
const showModal = ref(false);
const actors = ref([]);
const film = ref({
  title: "",
  description: "",
  releaseDate: "",
  imageUrl: ""
});



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

function openFilmModal(){
    showModal.value = true;
}

function closeFilmModal() {
    showModal.value = false;
    actors.value.splice(0, actors.value.length);
}

function addActor() {
    actors.value.push("");
}

async function submitFilm() {
  const payload = {
    title: film.value.title,
    description: film.value.description,
    releaseDate: film.value.releaseDate,
    imageUrl: film.value.imageUrl,
    actors: actors.value
  };

  try {
    const res = await fetch("http://localhost:3000/api/add/film", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Failed to add film");
    const data = await res.json();
    console.log("Film added:", data);

    // reset form
    film.value = { 
        title: "", 
        description: "", 
        releaseDate: "", 
        imageUrl: "" 
    };
    
    actors.value = [""];
    closeFilmModal();
  } catch (err) {
    console.error(err);
  }
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
    padding: 30px 10px;
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
    transition: all 0.3s ease;
}

.carousel-item:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px gold;
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

.add-film-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

.add-film-btn {
    background: black;
    color: gold;
    font-family: 'Cinzel', serif;
    font-size: 1.2rem;
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

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(17, 17, 17, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}

.modal-content {
    background: black;
    border: 2px solid gold;
    border-radius: 10px;
    padding: 30px;
    width: 400px;
    text-align: center;
    color: gold;
    font-family: 'Cinzel', serif;
    box-shadow: 0 0 20px gold;
    max-height: 80vh;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: gold black;
}

.close-btn {
    margin-top: 20px;
    background: gold;
    color: black;
    border: none;
    padding: 8px 16px;
    font-weight: bold;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.close-btn:hover {
    background: black;
    color: gold;
}

.form-group {
    width: 300px;
    margin: 20px auto;
    font-family: 'Roboto', sans-serif;
}

fieldset {
    border: 2px solid gold;
    border-radius: 20px;
    margin: 10px 0px;
    padding: 0 15px 10px 15px;
}

legend {
    font-size: 14px;
    color: gold;
    font-family: 'Cinzel', serif;
    margin-bottom: 5px;
    text-align: left;
    padding-left: 5px;
    padding-right: 5px;
}

fieldset:focus-within {
    box-shadow: 0 0 20px gold;
}

input[type="text"] {
    width: 100%;
    border: none;
    background: transparent;
    padding: 8px 0;
    font-size: 16px;
    color: gold;
    border-bottom: 2px solid #aaa;
}

input[type="text"]:focus {
    outline: none;
    border-bottom: 2px solid gold;
}

input[type="text"]:focus:valid{
    text-shadow: 4px 0px 5px goldenrod;
}

/* Not in focus and is a valid input */
input[type="text"]:not(:focus):valid {
    border-bottom: 2px solid rgb(129, 110, 2);
    text-shadow: 4px 0px 5px goldenrod;
}

textarea {
    width: 100%;
    min-height: 120px;
    resize: vertical;
    border: none;
    background: transparent;
    padding: 8px 0;
    font-size: 16px;
    color: gold;
    border-bottom: 2px solid #aaa;
    line-height: 1.4;
    word-wrap: break-word;
}

textarea:focus{
    outline: none;
    border-bottom: 2px solid gold;
}

textarea:focus:valid{
    text-shadow: 4px 0px 5px goldenrod;
}

textarea:not(:focus):valid{
    text-shadow: 4px 0px 5px goldenrod;
    border-bottom: 2px solid rgb(129, 110, 2);
}

input[type="date"] {
    width: 100%;
    border: none;
    background: transparent;
    padding: 8px 0;
    font-size: 16px;
    color: white;
    border-bottom: 2px solid #aaa;
}

input[type="date"]:focus {
    outline: none;
    border-bottom: 2px solid gold;
    color: gold;
}

input[type="date"]:not(:focus):valid {
    color: gold;
    border-bottom: 2px solid rgb(129, 110, 2);
}

input[type="url"] {
    width: 100%;
    border: none;
    background: transparent;
    padding: 8px 0;
    font-size: 16px;
    color: gold;
    border-bottom: 2px solid #aaa;
}

input[type="url"]:focus {
    outline: none;
    border-bottom: 2px solid gold;
}

input[type="url"]:not(:focus):valid {
    border-bottom: 2px solid rgb(129, 110, 2);
}

textarea:focus:valid{
    text-shadow: 4px 0px 5px goldenrod;
}

.form-scroll {
    overflow-y: auto;
    max-height: 60vh;
    padding-right: 10px;
}


img[src$=".svg"] {
    filter: invert(1) brightness(2);
}
</style>
