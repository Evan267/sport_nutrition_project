<template>
  <div id="meal">
      <input type="date" name="date" id="date" v-model="dateMeal" @change.prevent="changeDate">
      <h2>Repas du {{ dateAffich }}</h2>
      <div class="totalCal">
        <div v-for="goal in goalsGet" :key="goal">
            <TodayTotal v-bind:count="total[goal.objectif]" v-bind:text="goal.objectifFR" v-bind:objectif="goal.min"/>
        </div>
    </div>
      <div v-if="mealsGet">
        <div v-for="(meal, index) in mealsGet" :key="meal" class="meals">
          <h3>{{ meal.name }} <span>{{ meal.date }}</span></h3>
          <div class="aliments">
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
                </tr>
            </thead>
            <tbody>
                <tr v-for="aliment in meal.foodEatens" :key="aliment">
                    <td>{{ aliment.foods.name }}</td>
                    <td>{{ aliment.foods.brand }}</td>
                    <td>{{ aliment.quantity }}g</td>
                    <td>{{ Math.round(aliment.foods.energy/100 * aliment.quantity)}}kcal</td>
                    <td>{{ Math.round((aliment.foods.protein/100 * aliment.quantity) * 100)/100 }}g</td>
                    <td>{{ Math.round((aliment.foods.fat/100 * aliment.quantity) * 100)/100 }}g</td>
                    <td>{{ Math.round((aliment.foods.saturate/100 * aliment.quantity) * 100)/100 }}g</td>
                    <td>{{ Math.round((aliment.foods.carb/100 * aliment.quantity) * 100)/100 }}g</td>
                    <td>{{ Math.round((aliment.foods.sugar/100 * aliment.quantity) * 100)/100 }}g</td>
                    <td>{{ Math.round((aliment.foods.salt/100 * aliment.quantity) * 100)/100 }}g</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="2">TOTAL</th>
                    <td>{{ totals[index].quantity }}g</td>
                    <td>{{ totals[index].energy }}kcal</td>
                    <td>{{ totals[index].protein }}g</td>
                    <td>{{ totals[index].fat }}g</td>
                    <td>{{ totals[index].saturate }}g</td>
                    <td>{{ totals[index].carb }}g</td>
                    <td>{{ totals[index].sugar }}g</td>
                    <td>{{ totals[index].salt }}g</td>
                </tr>
            </tfoot>
          </div>
        </div>
      </div>
      <button @click.prevent="addNewMeal" id="buttonAddMeal"><i class="fas fa-plus-circle"></i></button>
      <div v-if="addMeal" id="createMeal">
          <CreateMeal/>
      </div>
  </div>
</template>

<script>
import TodayTotal from '@/components/nutrition/TodayTotal.vue'
import CreateMeal from '@/components/nutrition/CreateMeal.vue'

export default {
  name: 'Meal',
  components: {
    TodayTotal,
    CreateMeal
  },
  data() {
      return {
          dateMeal: null,
          dateAffich: null,
          goalsGet:  null,
          addMeal: false,
          mealsGet: [],
          totals: [],
          total: {
            quantity: 0,
            energy: 0,
            protein: 0,
            fat: 0,
            saturate: 0,
            carb: 0,
            sugar: 0,
            salt: 0
          }
      }
  },
  created (){
      this.today();
  },
  methods: {
      async addNewMeal (){
          this.addMeal = !this.addMeal;
          const button = document.getElementById('buttonAddMeal');
          if(this.addMeal){
              button.classList.add('stopAddMeal');
          } else {
              button.classList.remove('stopAddMeal');
          }
      },
      async changeDate(){
          let date = new Date();
          const year = this.dateMeal.slice(0,4);
          const month = new Number(this.dateMeal.slice(5,7));
          const day = this.dateMeal.slice(8,10);
          date.setFullYear(year);
          date.setMonth(month - 1);
          date.setDate(day);
          const option = { dateStyle: "medium" };
          this.dateAffich = date.toLocaleString("fr-FR", option);
          sessionStorage.date = this.dateMeal;
          await this.getMeals();
      },
      async today(){
          let today = new Date();
          const option = { dateStyle: "medium" };
          this.dateAffich = today.toLocaleString("fr-FR", option);
          const year = new String(today.getFullYear());
          const month = new String(today.getMonth() + 1);
          const day = new String(today.getDate());
          this.dateMeal = year + '-';
          if(month.length == 1){
              this.dateMeal += '0' + month + '-';
          } else {
              this.dateMeal += month + '-';
          }
          if(day.length == 1){
              this.dateMeal += '0' + day;
          } else {
              this.dateMeal += day;
          }
          sessionStorage.setItem('date', this.dateMeal);
          await this.getMeals();
      },
      async getMeals(){
          const url = "http://localhost:3000/api/meals/date/" + this.dateMeal;
          const myHeader = new Headers({'Content-Type': 'application/json',"Authorization": "Basic " + localStorage.getItem("token")});
          const request = new Request(
              url,
              {
                  method:  "GET",
                  headers: myHeader,
                  mode: "cors",
              }
          );
          await fetch(request)
            .then(res => res.json())
            .then(data => {
                this.mealsGet = data.meals;
                for(let i = 0; i < this.mealsGet.length; i++){
                    this.totals[i] = {
                        quantity: 0,
                        energy: 0,
                        protein: 0,
                        fat: 0,
                        saturate: 0,
                        carb: 0,
                        sugar: 0,
                        salt: 0
                    }
                    this.mealsGet[i].foodEatens.forEach(aliment => {
                        this.totals[i].quantity += aliment.quantity;
                        this.totals[i].energy += Math.round(aliment.foods.energy/100 * aliment.quantity);
                        this.totals[i].protein += Math.round((aliment.foods.protein/100 * aliment.quantity) * 100)/100;
                        this.totals[i].fat += Math.round((aliment.foods.fat/100 * aliment.quantity) * 100)/100;
                        this.totals[i].saturate += Math.round((aliment.foods.saturate/100 * aliment.quantity) * 100)/100;
                        this.totals[i].carb += Math.round((aliment.foods.carb/100 * aliment.quantity) * 100)/100;
                        this.totals[i].sugar += Math.round((aliment.foods.sugar/100 * aliment.quantity) * 100)/100;
                        this.totals[i].salt += Math.round((aliment.foods.salt/100 * aliment.quantity) * 100)/100;
                    });
                    let meal = this.mealsGet[i];
                    let dateComplet =  new Date(meal.date);
                    const optionDate = { dateStyle: "medium"};
                    let date = dateComplet.toLocaleString("fr-FR", optionDate);
                    const optionTime = { timeStyle: "medium"};
                    let time = dateComplet.toLocaleString("fr-FR", optionTime).slice(0, -3).replace(':',  'h');
                    meal.date = "du " + date + " à " + time;
                }
            })
            .catch(error => console.log(error));
          await this.totalData();
      },
      async totalData(){
          this.totals.forEach(tot => {
              this.total.quantity += tot.quantity;
              this.total.energy += tot.energy;
              this.total.protein += tot.protein;
              this.total.fat += tot.fat;
              this.total.saturate += tot.saturate;
              this.total.carb += tot.carb;
              this.total.sugar += tot.sugar;
              this.total.salt += tot.salt;
          });
          console.log(this.total);
          await this.getGoals();
      },
      async getGoals(){
          this.date = sessionStorage.date;
          const url = "http://localhost:3000/api/goals/" + this.date + "/simple";
          const myHeader = new Headers({'Content-Type': 'application/json',"Authorization": "Basic " + localStorage.getItem("token")});
          const request = new Request(
              url,
              {
                  method:  "GET",
                  headers: myHeader,
                  mode: "cors",
              }
          );
          await fetch(request)
            .then(res => res.json())
            .then(data => this.goalsGet = data.goals)
            .catch(error => console.log(error));
          for(let i = 0;i < this.goalsGet.length;  i++){
              if(this.goalsGet[i].objectif == 'energy'){
                  this.goalsGet[i].unit = 'kcal';
              } else {
                  this.goalsGet[i].unit = 'g';
              }
              if(this.goalsGet[i].objectif == 'energy'){
                  this.goalsGet[i].objectifFR = 'Calories';
              } else if(this.goalsGet[i].objectif == 'protein') {
                  this.goalsGet[i].objectifFR = 'Protéines';
              } else if(this.goalsGet[i].objectif == 'fat') {
                  this.goalsGet[i].objectifFR = 'Lipides';
              } else if(this.goalsGet[i].objectif == 'saturate') {
                  this.goalsGet[i].objectifFR = 'Acides gras saturés';
              } else if(this.goalsGet[i].objectif == 'carb') {
                  this.goalsGet[i].objectifFR = 'Glucides';
              } else if(this.goalsGet[i].objectif == 'sugar') {
                  this.goalsGet[i].objectifFR = 'Sucres';
              } else if(this.goalsGet[i].objectif == 'salt') {
                  this.goalsGet[i].objectifFR = 'Sels';
              } else if(this.goalsGet[i].objectif == 'quantity') {
                  this.goalsGet[i].objectifFR = 'Quantité';
              }
          }
          console.log(this.goalsGet);
      }
  }
}
</script>


<style scoped>
#meal{
    animation:apparition 400ms both ease-in;
}
.totalCal{
    display: flex;
    margin: 2vw 4vw;
    justify-content: space-between;
}
#date{
    margin-top: 2vw;
}
.meals{
    text-align:start;
    background-color: #1D2334 ;
    border-radius: 2em;
    margin: 2vw 4vw;
    padding: 1vw 3vw;
}
h3 span{
    font-size: 0.85em;
    font-weight: normal;
}
button{
    font-size: 5em;
    padding: 0;
    border: none;
    border-radius: 50%;
    height: min-content;
    color: #00818A;
    cursor: pointer;
    background-color: transparent;
    transition: all 400ms ease-in-out;
    z-index: 110;
}
button:hover{
    opacity: 0.7;
}
.stopAddMeal{
    transform: translateX(45vw) translateY(-0.3em) rotate(405deg) scale(0.5);
    color: #B60303;
}
#createMeal{
    position:relative;
    bottom: 4.4em;
    z-index:1;
    animation:apparition 600ms both ease-in;
}
.aliments{
    text-align: center;
    width: 85vw;
    margin: 1vw auto 1vw;
    border-radius: 3em;
    overflow: hidden;
    border: 2px solid #00818A;
}
thead {
    width: 100%;
    border-radius: 3em 3em 0 0;
}
th{
    padding: 1em 1.035em;
    background-color:#00818A;
    color: white;
}
td{
    padding: 1em 0;
}
tfoot td{
    border-top: 1px solid #00818A;
}

@keyframes apparition {
    0% {
        opacity: 0;
    }
    100%{
        opacity: 1;
    }
}
</style>