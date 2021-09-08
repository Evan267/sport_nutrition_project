<template>
  <div id="objectif">
      <h2>Objectif nutritionelle</h2>
      <form action="" @submit.prevent="createGoal">
          <input class="goal__date" type="date" v-model="date" @change="changeDate()">
          <div class="goal">
            <table v-if="bodyCreate.length > 0">
              <thead>
                  <tr>
                      <th>Début</th>
                      <th>Fin</th>
                      <th>Objectif</th>
                      <th>Minimum par jour</th>
                      <th>Maximum par jour</th>
                      <th>Priorité</th>
                      <th></th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="goal in dataGet" :key="goal">
                      <td>{{ goal.startFR }}</td>
                      <td>{{ goal.endFR }}</td>
                      <td v-if="goal.objectif == 'energy'">Énergie</td>
                      <td v-if="goal.objectif == 'protein'">Protéine</td>
                      <td v-if="goal.objectif == 'fat'">Lipides</td>
                      <td v-if="goal.objectif == 'saturate'">Acide gras saturées</td>
                      <td v-if="goal.objectif == 'carb'">Glucide</td>
                      <td v-if="goal.objectif == 'sugar'">Sucre</td>
                      <td v-if="goal.objectif == 'salt'">Sel</td>
                      <td>{{ goal.min }}{{ goal.unit }}</td>
                      <td>{{ goal.max }}{{ goal.unit }}</td>
                      <td v-if="goal.priority == 1">Très faible</td>
                      <td v-if="goal.priority == 2">Faible</td>
                      <td v-if="goal.priority == 3">Moyen</td>
                      <td v-if="goal.priority == 4">Élevée</td>
                      <td v-if="goal.priority == 5">Très élevée</td>
                  </tr>
                  <tr v-for="(goal, index) in bodyCreate" :key="goal">
                      <td><input type="date" class="goal__start" v-model="goal.start"></td>
                      <td><input type="date" class="goal__end" v-model="goal.end"></td>
                      <td>
                          <select class="goal__objectif" v-model="goal.objectif">
                            <option value="quantity">Quantité</option>
                            <option value="energy">Énergie</option>
                            <option value="protein">Protéine</option>
                            <option value="fat">Lipides</option>
                            <option value="saturate">Acide gras saturées</option>
                            <option value="carb">Glucide</option>
                            <option value="sugar">Sucre</option>
                            <option value="salt">Sel</option>
                          </select>
                      </td>
                      <td><input type="number" class="goal__min" v-model="goal.min"></td>
                      <td><input type="number" class="goal__max" v-model="goal.max"></td>
                      <td>
                          <select class="goal__priority" v-model="goal.priority">
                              <option value="5">Très élevée</option>
                              <option value="4">Élevée</option>
                              <option value="3">Moyen</option>
                              <option value="2">Faible</option>
                              <option value="1">Très faible</option>
                          </select>
                      </td>
                      <td><button @click.prevent="deleteNewGoal(index)" id="buttonDeleteMeal">x</button></td>
                  </tr>
              </tbody>
            </table>
          </div>
          <button @click.prevent="addNewGoal" id="buttonAddGoal"><i class="fas fa-plus-circle"></i></button>
          <div>
              <p>{{ resultCreate }}</p>
          </div>
          <button type="submit" class="goal__save">Enregistrer</button>
      </form>
  </div>
</template>

<script>
export default {
  name: 'Objectif',
  data(){
      return{
          date: null,
          bodyCreate: [
              {
                  start: null,
                  end: null,
                  objectif: null,
                  min: null,
                  max: null,
                  priority: null
              }
          ],
          dataCreate: '',
          resultCreate: '',
          dataGet: null
      };
  },
  created (){
      this.getGoals();
  },
  methods: {
      async changeDate(){
          sessionStorage.date = this.date;
          await this.getMeals();
      },
      async getGoals(){
          this.date = sessionStorage.date;
          const url = "http://localhost:3000/api/goals/" + this.date;
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
            .then(data => this.dataGet = data.goals)
            .catch(error => console.log(error));
          for(let i = 0;i < this.dataGet.length;  i++){
              if(this.dataGet[i].objectif == 'energy'){
                  this.dataGet[i].unit = 'kcal';
              } else {
                  this.dataGet[i].unit = 'g';
              }
              const option = {dateStyle: 'short'}
              let dateStart = new Date(this.dataGet[i].start).toLocaleString("fr-FR", option);
              let dateEnd = new Date(this.dataGet[i].end).toLocaleString("fr-FR", option);
              this.dataGet[i].startFR = dateStart;
              this.dataGet[i].endFR = dateEnd;
          }
          console.log(this.dataGet);
      },
      async deleteNewGoal(index){
          this.bodyCreate.splice(index, 1);
      },
      async addNewGoal(){
          const newGoal = {
            start: null,
            end: null,
            objectif: null,
            min: null,
            max: null,
            priority: null
          };
          this.bodyCreate.push(newGoal);
      },
      async createGoal () {
          const url = "http://localhost:3000/api/goals";
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
          .then(res => res.json())
          .then(json => this.dataCreate = json)
          .catch(error => this.dataCreate = error);
          console.log(this.dataCreate);
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
#objectif{
    background-color: #1D2334 ;
    border-radius: 2em;
    margin: 2vw 4vw;
    padding: 1vw 0 2vw;
    animation:apparitionHorizontalLeft 400ms both ease-in;
}
#objectif form{
    display: flex;
    flex-direction: column;
    margin: 0;
}
.goal{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.goal__date{
    width:min-content;
    margin:0 auto 3vw;
}
.goal__save{
    width:min-content;
    margin-left: auto;
    margin-right: 10vw;
}
td button{
    background-color: transparent;
    color: #B60303;
}
#buttonAddGoal{
    font-size: 3em;
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
#buttonAddGoal:hover{
    opacity: 0.7;
}

</style>