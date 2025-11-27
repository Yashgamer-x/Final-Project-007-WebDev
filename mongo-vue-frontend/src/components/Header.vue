<!-- HTML -->
<template>
<nav id="nav">
    <img src="../assets/007.png" alt="007 Logo" class="logo-007">
    <ul class="nav-ul">
        <li><a href="#films">Films</a></li>
        <li><a href="#actors">Actors</a></li>
    </ul>
</nav>
</template>

<!-- CSS -->
<style scoped>
.logo-007 {
    width: 120px;
    height: auto;
    filter: drop-shadow(0 0 5px gold);
}

.nav-ul {
    list-style-type: none;
    display: flex;
    gap: 20px;
    font-family: 'Cinzel', serif;
}

.nav-ul li a {
    text-decoration: none;
    color: gold;
    font-weight: bold;
    transition: color 0.3s ease, text-shadow 0.3s ease;
}

.nav-ul li a:hover {
    color: white;
    text-shadow: 0 0 10px gold;
}

#nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 30px;
    background: linear-gradient(90deg, black, #1a1a1a);
    border-bottom: 2px solid gold;
}
</style>


<!-- JavaScript -->
<script setup>
</script>