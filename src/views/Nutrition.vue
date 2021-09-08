<template>
  <div id="nutrition">
    <h1>Nutrition</h1>
    <div class="navNutrition">
        <router-link :to="{ name: 'objectif'}">Objectif</router-link>
        <router-link :to="{ name: 'meal'}">Repas</router-link>
        <router-link :to="{ name: 'createAliment'}">Aliment</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Nutrition',
}
</script>


<style scoped>
.navNutrition{
    background-color: #00818A;
    width: 45vw;
    margin: 0 auto;
    border-radius:  2vw;
    display: flex;
    justify-content: space-around;
    overflow: hidden;
}
.navNutrition a{
    width: 15vw;
}

</style>