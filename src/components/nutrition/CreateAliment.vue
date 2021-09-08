<template>
  <div id="createAliment">
      <h2>Nouvel aliment</h2>
      <form action="" @submit.prevent="createFood">
          <div class="input">
            <label for="aliment-name">Nom de l'aliment</label>
            <input type="text" name="aliment-name" id="aliment-name" v-model="bodyCreate.name">
          </div>
          <div class="input">
            <label for="aliment-brand">Marque</label>
            <input type="text" name="aliment-brand" id="aliment-brand" v-model="bodyCreate.brand">
          </div>
          <div class="input">
            <label for="aliment-energy">Énergie</label>
            <div class="inputNutriment"><input type="number" @focus="focusInput(0)" @blur="blurInput(0)" name="aliment-energy" id="aliment-energy" v-model="bodyCreate.energy"><span> kcal</span></div>
          </div>
          <div class="input">
            <label for="aliment-prot">Protéines</label>
            <div class="inputNutriment"><input type="number" @focus="focusInput(1)" @blur="blurInput(1)" name="aliment-prot" id="aliment-prot" v-model="bodyCreate.protein" step="any"><span> g</span></div>
          </div>
          <div class="input">
            <label for="aliment-fat">Lipides</label>
            <div class="inputNutriment"><input type="number" @focus="focusInput(2)" @blur="blurInput(2)" name="aliment-fat" id="aliment-fat" v-model="bodyCreate.fat" step="any"><span> g</span></div>
          </div>
          <div class="input">
            <label for="aliment-saturate">*dont saturés</label>
            <div class="inputNutriment"><input type="number" @focus="focusInput(3)" @blur="blurInput(3)" name="aliment-saturate" id="aliment-saturate" v-model="bodyCreate.saturate" step="any"><span> g</span></div>
          </div>
          <div class="input">
            <label for="aliment-carb">Glucides</label>
            <div class="inputNutriment"><input type="number" @focus="focusInput(4)" @blur="blurInput(4)" name="aliment-carb" id="aliment-carb" v-model="bodyCreate.carb" step="any"><span> g</span></div>
          </div>
          <div class="input">
            <label for="aliment-sugar">*dont sucres</label>
            <div class="inputNutriment"><input type="number" @focus="focusInput(5)" @blur="blurInput(5)" name="aliment-sugar" id="aliment-sugar" v-model="bodyCreate.sugar" step="any"><span> g</span></div>
          </div>
          <div class="input">
            <label for="aliment-salt">Sel</label>
            <div class="inputNutriment"><input type="number" @focus="focusInput(6)" @blur="blurInput(6)" name="aliment-salt" id="aliment-salt" v-model="bodyCreate.salt" step="any"><span> g</span></div>
          </div>
          <div>
              <p>{{ resultCreate }}</p>
          </div>
          <button type="submit">Créer</button>
      </form>
  </div>
</template>

<script>
export default {
  name: 'CreateAliment',
  data(){
      return{
          bodyCreate: {
              name: null,
              brand: null,
              energy: null,
              protein: null,
              fat: null,
              saturate: null,
              carb: null,
              sugar: null,
              salt: null
          },
          dataCreate: '',
          resultCreate: ''
      };
  },
  methods: {
      async createFood () {
          const url = "http://localhost:3000/api/aliments";
          const myHeader = new Headers({'Content-Type': 'application/json',"Authorization": "Basic " + localStorage.getItem("token")});
          const request = new Request(
              url,
              {
                  method:  "POST",
                  headers: myHeader,
                  mode: "cors",
                  cache: "default",
                  body: JSON.stringify(this.bodyCreate)
              }
          );
          await fetch(request)
          .then(res => {
              if(res.status == 201){
                  this.resultCreate = "L'aliment a été créé";
                  this.bodyCreate = {
                    name: null,
                    brand: null,
                    energy: null,
                    protein: null,
                    fat: null,
                    saturate: null,
                    carb: null,
                    sugar: null,
                    salt: null
                  }
              } else if (res.status == 400){
                  this.resultCreate = "L'aliment existe déjà"
              }
              res.json();
          })
          .then(json => {
              this.dataCreate = json;
              if(this.dataCreate.error.errors[0].message == 'food.name must be unique'){
                  this.resultCreate = "L'aliment existe déjà";
              }
            })
          .catch(error => this.dataCreate = error);
      },
      async focusInput(index){
          const inputs = document.getElementsByClassName('inputNutriment');
          inputs[index].classList.add('border');
      },
      async blurInput(index){
          const inputs = document.getElementsByClassName('inputNutriment');
          inputs[index].classList.remove('border');
      }
  }
}
</script>


<style scoped>
#createAliment{
    background-color: #1D2334 ;
    border-radius: 2em;
    margin: 2vw 4vw;
    padding: 1vw 0;
    animation:apparitionHorizontalRight 400ms both ease-in;
}
form{
    width: 25vw;
    display:grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    column-gap: 4vw;
    margin: 2vw 5vw; 
}
.input{
    text-align: start;
    margin: 0.5vw 0;
}
.input input{
    width: 22vw;
    height: 3vw;
    border-radius: 1.5vw;
    padding: 0 1vw;
}
.inputNutriment{
    display: flex;
    align-items:center;
    width: 22vw;
    background-color: #404B69;
    border: 2px solid #404B69;
    border-radius: 1.5vw;
    padding: 0 1vw;
}
.inputNutriment input{
    background-color: transparent;
    border: transparent;
    padding: 0;
    border-radius: 0;
}
.inputNutriment span{
    width: min-content;
    align-items: end;
}
.border{
    border-color:#00818A;
}
#createAliment button{
    background-color:#00818A;
    color: #DBEDF3;
    font-size: 1.8em;
    padding: 1vw 2vw;
    border-radius: 1.5em;
    margin: 3vw;
}
</style>