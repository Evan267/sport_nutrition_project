<template>
  <div id="objectif">
      <h2>Objectif</h2>
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