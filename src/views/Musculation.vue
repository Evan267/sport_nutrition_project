<template>
  <div id="musculation">
    <h1>Musculation</h1>
    <div class="navMusculation">
        <router-link :to="{ name: 'objectifMuscu'}">Objectif</router-link>
        <router-link :to="{ name: 'program'}">Programme</router-link>
        <router-link :to="{ name: 'createExercice'}">Exercice</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Musculation',
}
</script>


<style scoped>
.navMusculation{
    background-color: #00818A;
    width: 45vw;
    margin: 0 auto;
    border-radius:  2vw;
    display: flex;
    justify-content: space-around;
    overflow: hidden;
}
.navMusculation a{
    width: 15vw;
}

</style>