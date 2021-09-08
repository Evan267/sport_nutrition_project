<template>
  <div class="logIn">
    <form @submit.prevent="connectUser">
        <h1>Se connecter</h1>
        <div>
            <p v-show="error" class="text-danger">L'adresse mail ou le mot de passe sont invalides.</p>
            <label for="email">Email:</label>
            <input type="text" id="email" name="user_email" v-model="post.email">
        </div>
        <div>
            <label for="passwordConnect">Mot de passe:</label>
            <input type="password" id="passwordConnect" name="user_password" v-model="post.password">
        </div>
        <div id="logInOrSignUp">
            <router-link to="/signup">S'inscrire</router-link>
            <button type="submit">Se connecter</button>
            
        </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LogIn',
  data() {
      return {
          post: {},
          data: {},
          error: false
      };
  },
  methods: {
      async connectUser() {
          const  myHeader = new Headers({'Content-Type': 'application/json'});
          const request = new Request(
              "http://localhost:3000/api/auth/login",
              {
                  method:  "POST",
                  headers: myHeader,
                  mode: "cors",
                  cache: "default",
                  body: JSON.stringify(this.post)
              }
          );
          const res  = await fetch(request);
          const data = await res.json();
          localStorage.setItem('token', data.token);
          if(localStorage.token !== "undefined"){
              this.$store.commit('viewNav', true);
              this.$router.push({name: "Home"});
          }else{
              this.error = true;
          }
      }
  }
}


</script>

<style scoped>
.logIn{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin:0;
}

.text-danger{
    color: #9E0000;
    font-size: 0.8em;
    text-align: center;
}

a{
    color:#2C3F51;
    text-decoration:none;
    cursor:pointer;
}

form{
    width: 100%;
}

div{
    display: flex;
    flex-direction: column;
    margin: 2vw 10%;
}

#logInOrSignUp{
    flex-direction: row;
    justify-content: space-evenly;
    align-items:center;
    margin-top:8vw;
}

</style>