<template>
  <div class="nav" v-if="visibleNav">
    <div @click="stopViewUser()" class="">
      <router-link to="/">Accueil</router-link>
      <router-link to="/musculation">Musculation</router-link>
      <router-link to="/nutrition">Nutrition</router-link>
    </div>
    <div class="userComponent">
      <User/>
    </div>
  </div>
  <router-view @click="stopViewUser()"/>
</template>

<script>
import User from '@/components/user/User.vue'
import { mapState } from 'vuex'

export default {
  components: {
    User
  },
  computed: {
      ...mapState(["visibleNav"])
  },
  methods: {
    async stopViewUser(){
      this.$store.commit('viewUser', false);
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.userComponent{
  position: absolute;
  top: 1vw;
  right: 2vw;
}
.nav{
  background-color: #00818A;
  text-align: start;
  height: max-content;
  padding: 2vw 2vw;
  display: flex;
}
a{
  padding: 1vw 2vw;
  text-decoration: none;
}
.nav a{
  padding: 2vw 2vw;
}
a:hover{
  background-color:#004C51 ;
}
.active{
    background-color: #00656C;
}
body{
  margin: 0;
}
html{
  color: #DBEDF3;
  background-color: #283149;
}
a{
  color: #DBEDF3;
}
input{
  color: #DBEDF3;
  background-color: #404B69;
  border: 2px solid #404B69;
}
input:focus{
  outline:none;
  border-color: #00818A;
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
button{
  background-color:#00818A;
  color: #DBEDF3;
  border: none;
  font-size: 1.5em;
  padding: 0.5em 1em;
  border-radius: 1.25em;
  cursor: pointer;
  transition: transform 300ms;
}
button:hover{
  transform: scale(1.1);
}
button:active {
  transform: scale(1);
}
@keyframes apparitionHorizontalRight {
    0% {
        opacity: 0;
        transform: translateX(100%);
    }
    100%{
        opacity: 1;
        transform: translateX(0%);
    }
}
@keyframes apparitionHorizontalLeft {
    0% {
        opacity: 0;
        transform: translateX(-100%);
    }
    100%{
        opacity: 1;
        transform: translateX(0%);
    }
}

</style>
