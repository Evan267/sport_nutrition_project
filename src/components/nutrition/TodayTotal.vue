<template>
  <div id="todayTotal">
      <h2>{{ text }} consommées aujourd'hui:</h2>
      <div class="total">
        <p>{{ count }}</p>
        <p class="slash">/</p>
        <p class="objectif">{{ objectif }}</p>
      </div>
  </div>
</template>

<script>
export default {
  name: 'TodayTotal',
  props: {
    count: {
      type: Number,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    objectif: {
      type: Number,
      required: true
    }
  }
}
</script>


<style scoped>
#todayTotal{
    background-color: #1D2334;
    width: 39vw;
    border-radius: 2em;
    padding: 1vw 3vw 0;
}
p{
    margin:0;
}
.total{
    position: relative;
    right: 4vw;
    top: 2vw;
    font-size: 1.7em;
}
.slash{
    font-size: 3em;
    font-weight: bold;
    position: relative;
    bottom: 0.7em;
    left: 0.6em;
}
.objectif{
    position: relative;
    bottom: 4.3em;
    left: 3.6em;
}
</style>