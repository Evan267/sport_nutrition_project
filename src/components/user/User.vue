<template>
    <div class="user">
        <button @click.prevent="viewUser()" class="user__btn">
            <img :src="userGet.user.image" alt="Photo de l'utilisateur" class="user__img">
        </button>
        <div class="user__info" v-if="userView">
            <div class="triangle"></div>
            <p class="user__fullname">{{ fullname }}</p>
            <router-link to="/user">Parametre de l'utilisateur</router-link>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'User',
  data() {
      return {
          post: {},
          userGet: {
              user: {
                  firstname:'',
                  lastname:'',
                  image:''
              }
          },
      };
  },
  computed: {
      fullname: function(){
          return this.userGet.user.firstname  + ' ' +  this.userGet.user.lastname;
      },
      ...mapState(["user", "isAdmin", "userView"])
  },
  created (){
      this.getUserData();
  },
  methods: {
      async viewUser(){
          const actualValue = this.userView;
          this.$store.commit('viewUser', !actualValue);
      },
      async getUserData() {
          const url = "http://localhost:3000/api/auth/";
          const myHeader = new Headers({'Content-Type': 'application/json',"Authorization": "Basic " + localStorage.getItem("token")});
          const request = new Request(
              url,
              {
                  method:  "GET",
                  headers: myHeader,
                  mode: "cors",
                  cache: "default",
              }
          );
          fetch(request)
            .then(res => {
                console.log(res.status);
                if(res.status === 401){
                    this.$router.push({name: "LogIn"})
                    localStorage.clear();
                    this.$store.commit('viewNav', false);
                }else{
                    this.$store.commit('viewNav', true);
                    return res.json()
                }
            })
            .then(data => this.userGet = data)
            .then(() => {
                this.$store.commit('getUserId', this.userGet.user.id);
                this.$store.commit('getAdmin', this.userGet.user.isAdmin);
                })
            .catch(error=> console.log(error));
      }
  }
}

</script>

<style scoped>
.user{
    text-align: end;
}
.user__btn{
    width:  4vw;
    background-color: transparent;
    border: none;
    padding:0;
}
.user__img{
    width: 4vw;
    height:4vw;
    border-radius: 50%;
    object-fit: cover;
}
.user__info{
    background-color: black;
    z-index: 40;
    border-radius: 1vw;
}
.triangle{
    position: absolute; 
    top: 4vw;
    right: 1vw;
    width: 2vw;
    height: 2vw;
    transform: rotate(45deg);
    background-color: black;
    z-index: 0;
}
.user__fullname{
    margin: 0;
    text-align: center;
}
</style>
