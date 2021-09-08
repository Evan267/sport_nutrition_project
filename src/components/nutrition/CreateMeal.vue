<template>
    <div class="createMeal">
        <form action="" @submit.prevent="saveMeal()">
          <label for="meal-select">Repas: </label>
          <select name="meal" id="meal-select" v-model="nameMeal">
              <option value="">Repas</option>
              <option value="Petit-déjeuner">Petit-déjeuner</option>
              <option value="Déjeuner">Déjeuner</option>
              <option value="Diner">Diner</option>
          </select>
          <label for="timemeal">Date</label>
          <input type="time" name="timemeal" id="timemeal" v-model="timeMeal">
          <p>*rentrez les aliments consommer pendant ce repas</p>
          <div class="searchAliment">
            <input type="search" @input="getFood()" v-model="search" class="inputAliment">
            <div class="listAliment">
                <div v-if="dataGet == null">
                    <p>Veuillez entrer votre recherche</p>
                </div>
                <div v-else-if="dataGet.food.length == 0">
                    <p>Aucun aliment trouvé</p>
                </div>
                <ul v-else>
                    <li v-for="(food, index) in dataGet.food" :key="food">
                        <hr v-if="index > 0">
                        <button @click.prevent="addAliment(food)" class="aliments">
                            <p>{{ food.name }}</p>
                            <p>{{ food.brand }}</p>
                        </button>
                    </li>
                </ul>
            </div>
          </div>
          <div v-if="aliments.length > 0">
              <div class="alimentChoice">
                <table>
                  <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Marque</th>
                        <th>Quantitée</th>
                        <th>Énergie</th>
                        <th>Protéines</th>
                        <th>Lipides</th>
                        <th>*saturées</th>
                        <th>Glucides</th>
                        <th>*dont sucres</th>
                        <th>Sels</th>
                        <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(aliment, index) in aliments" :key="aliment">
                        <td>{{ aliment.name }}</td>
                        <td>{{ aliment.brand }}</td>
                        <td><input type="number" v-model.number="aliment.quantity" class="quantity" @input.prevent="tot()">g</td>
                        <td>{{ Math.round(aliment.energy/100 * aliment.quantity) }}kcal</td>
                        <td>{{ Math.round((aliment.protein/100 * aliment.quantity) * 100)/100 }}g</td>
                        <td>{{ Math.round((aliment.fat/100 * aliment.quantity) * 100)/100 }}g</td>
                        <td>{{ Math.round((aliment.saturate/100 * aliment.quantity) * 100)/100 }}g</td>
                        <td>{{ Math.round((aliment.carb/100 * aliment.quantity) * 100)/100 }}g</td>
                        <td>{{ Math.round((aliment.sugar/100 * aliment.quantity) * 100)/100 }}g</td>
                        <td>{{ Math.round((aliment.salt/100 * aliment.quantity) * 100)/100 }}g</td>
                        <td><button @click.prevent="deleteAliment(index)" class="delete"><i class="fas fa-trash-alt"></i></button></td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                        <th colspan="2">TOTAL</th>
                        <td>{{ total.quantity }}g</td>
                        <td>{{ total.energy }}kcal</td>
                        <td>{{ total.protein }}g</td>
                        <td>{{ total.fat }}g</td>
                        <td>{{ total.saturate }}g</td>
                        <td>{{ total.carb }}g</td>
                        <td>{{ total.sugar }}g</td>
                        <td>{{ total.salt }}g</td>
                        <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <button type="submit" class="save">Enregistrer le repas</button>
          </div>
          <div v-else class="noFood">
              <p>Pas d'aliment enregistrer pour ce repas</p>
          </div>
      </form>
    </div>
</template>

<script>
export default {
  name: 'Meal',
  data() {
      return {
          nameMeal: null,
          timeMeal: null,
          search: '',
          aliments: [],
          dataGet: null,
          total:{
              quantity: null,
              energy: null,
              protein: null,
              fat: null,
              saturate: null,
              carb: null,
              sugar: null,
              salt: null
          }
      }
  },
  created (){
      this.time();
  },
  methods: {
      async time(){
          let today = new Date();
          const option = { timeStyle: "medium"};
          let time = today.toLocaleString('fr-FR', option);
          this.timeMeal = time.slice(0, -3);
      },
      async tot(){
          let total = {
              quantity: 0,
              energy: 0,
              protein: 0,
              fat: 0,
              saturate: 0,
              carb: 0,
              sugar: 0,
              salt: 0
          }
          this.aliments.forEach(aliment => {
              total.quantity += aliment.quantity;
              total.energy += Math.round(aliment.energy/100 * aliment.quantity);
              total.protein += Math.round((aliment.protein/100 * aliment.quantity) * 100)/100;
              total.fat += Math.round((aliment.fat/100 * aliment.quantity) * 100)/100;
              total.saturate += Math.round((aliment.saturate/100 * aliment.quantity) * 100)/100;
              total.carb += Math.round((aliment.carb/100 * aliment.quantity) * 100)/100;
              total.sugar += Math.round((aliment.sugar/100 * aliment.quantity) * 100)/100;
              total.salt += Math.round((aliment.salt/100 * aliment.quantity) * 100)/100;
          });
          this.total = total;
      },
      async getFood() {
          const url = "http://localhost:3000/api/aliments/" + this.search + "/" + 0 + "/" + 5;
          const myHeader = new Headers({'Content-Type': 'application/json',"Authorization": "Basic " + localStorage.getItem("token")});
          const request = new Request(
              url,
              {
                  method:  "GET",
                  headers: myHeader,
                  mode: "cors",
              }
          );
          if(this.search == ''){
              this.dataGet = null;
          }else{
              fetch(request)
                .then(res => res.json())
                .then(data => this.dataGet = data)
                .catch(error => console.log(error));
          }
      },
      async addAliment(food){
          food.quantity = 100;
          this.aliments.push(food);
          this.search = '';
          this.dataGet = null;
          await this.tot();
      },
      async deleteAliment(index){
          this.aliments.splice(index, 1);
          await this.tot();
      },
      async saveMeal(){
          const url = "http://localhost:3000/api/meals";
          const myHeader = new Headers({'Content-Type': 'application/json',"Authorization": "Basic " + localStorage.getItem("token")});
          let date = sessionStorage.date + ' ' + this.timeMeal +':00';
          let body = {
              name: this.nameMeal,
              date: date,
              aliments: []
          };
          this.aliments.forEach(aliment => {
              let data = {
                  quantity: aliment.quantity,
                  foodId: aliment.id,
                  mealId: null
              }
              body.aliments.push(data);
          });
          const request = new Request(
              url,
              {
                  method:  "POST",
                  headers: myHeader,
                  mode: "cors",
                  cache: "default",
                  body: JSON.stringify(body)
              }
          );
          await fetch(request)
          .then(res => res.json())
          .then(json => {
              this.$router.push({name: "meal"});
              this.dataCreate = json;
          })
          .catch(error => this.dataCreate = error);
          console.log(this.dataCreate);
      }
  }
}
</script>


<style scoped>
.createMeal{
    background-color: #1D2334 ;
    border-radius: 2em;
    margin: 0 4vw;
    padding: 2vw 3vw 3vw;
}
.createMeal form{
    display: block;
    text-align: center;
}
p{
    margin: 0 1em;
}
ul{
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
}
hr{
    height: 0.5px;
    color:grey;
    background-color: grey;
}
.searchAliment{
    position: absolute;
    left: 35vw;
    width: 30vw;
    margin: auto;
    overflow: hidden;
}
.inputAliment{
    width: 27vw;
    padding: 0.5vw;
    z-index: 100;
    border-radius: 1em;
}
.listAliment{
    margin: auto;
    width: 28vw;
    padding: 0vw;
    opacity: 0;
    z-index: -11;
    background-color: #404B69;
    border-radius: 0 0 1em 1em;
    overflow: hidden;
}
.inputAliment:focus{
    outline: none;
    border-radius: 1em 1em 0 0;
    border-bottom: 1px solid #DBEDF3;
}
.inputAliment:focus ~ .listAliment{
    opacity: 1;
    z-index: 11;
}
.aliments{
    background: transparent;
    border: none;
    cursor: pointer;
    width: 100%;
    color:#DBEDF3;
}
.aliments:hover{
    background-color: #283149;
}
.alimentChoice{
    width: 85vw;
    margin: 3em auto 2em;
    border-radius: 3em;
    overflow: hidden;
    border: 2px solid #00818A;
}
thead {
    width: 100%;
    border-radius: 3em 3em 0 0;
}
th{
    padding: 1em 1em;
    background-color:#00818A;
    color: white;
}
td{
    padding: 1em 0;
}
tfoot td{
    border-top: 1px solid #00818A;
}
.quantity{
    width: 40%;
    padding: 0.2em;
    border-radius: 0.2em;
    text-align: end;
}
.delete{
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    font-size: 1.1em;
}
.delete i{
    color: #B60303;
}
.delete:hover i{
    opacity: 0.6;
}
.save{
    background-color:#DBEDF3;
    font-size: 1.2em;
    color:#283149;
    border-radius: 1em;
    padding: 0.5em 1em;
    border: none;
    margin-bottom: 2em;
    box-shadow: 0px 0px 2px #DBEDF3;
    cursor: pointer;
}
.save:hover{
    box-shadow: inset 0px 0px 10px #283149;
}
.noFood{
    margin-top: 4em;
}
</style>