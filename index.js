Vue.component('page', {
   props:["index", "selectedPage", "footer", "nextPredicate"],
   methods:{
      previous(){
         this.selectedPage.index--;
      },
      next(){
         if(this.nextPredicate===undefined || this.nextPredicate()){
            this.selectedPage.index++;
         }
      }
   },
   template:`
   <div class="panel" v-bind:class="{enabled:index==selectedPage.index}">
      <div class="container text-center">
         <div style="margin: 10% 0% 10%;">
            <slot></slot>
            <div v-if="footer">
               <hr>
               <button v-if="index>0" class="btn btn-primary float-left" @click="previous">Powrót</button>
               <button class="btn btn-primary float-right" @click="next">Dalej</button>
            </div>
         </div>
      </div>
   </div>
   `
});

Vue.component('session-selection', {
   props:["formData", "title", "sessions"],
   methods:{
      previous(){
         this.selectedPage.index--;
      },
      next(){
         if(this.nextPredicate===undefined || this.nextPredicate()){
            this.selectedPage.index++;
         }
      }
   },
   template:`
<div>
<h1 class="font-weight-bold">"{{title}}"</h1>
         <hr>
         <h4>Seans:</h4>
         <div class="btn-group btn-group-toggle btn-group-vertical col-sm-12" data-toggle="buttons">
            <label @click="formData.session=s" v-for="s in sessions" class="btn btn-secondary"
               v-bind:class="{active:formData.session==s}">
               <input type="radio" name="sessions" :id="s" autocomplete="off">{{s}}
            </label>
         </div>
      <hr>
</div>
`
});

Vue.component("discount-selection", {
   props:["formData", "discounts", "toPay"],
   template:`
<div>
   <h3>Zniżka:</h3>
   <hr>
   <div class="btn-group btn-group-toggle btn-group-vertical col-sm-12" data-toggle="buttons">
      <label @click="formData.discount=d" v-for="d in discounts" class="btn btn-secondary"
         v-bind:class="{active:formData.discount==d}">
         <input type="radio" name="discounts" :id="d" autocomplete="off">{{d}}
      </label>
   </div>
   <hr>
   <h3>Do zapłaty:</h3>
   <p>{{formData.selectedSeats.size}}x20zł<br>
      <span v-if="formData.discount.value>0">-{{formData.discount.value}}%<br></span>=>
      <span class="font-weight-bold">{{toPay}}zł</span>
   </p>
</div>
   `
})

Vue.component('seat-selection', {
   props:["formData", "seats"],
   template: `
<div class="form-group">
   <h3>Wybierz miejsca na sali</h3>
   <hr>
   <div class="alert alert-danger" role="alert" style="display:none;">
      Musisz wybrać co najmniej jedno miejsce
   </div>
   <div class="row justify-content-center">
      <div v-for="(row, rowIndex) in seats" class="col-8 btn-group justify-content-center">
         <template v-for="(seat, seatIndex) in row">
            <button type="button" v-if="seat" class="btn btn-primary" 
               v-bind:class="{active:formData.selectedSeats.has(''+rowIndex+'-'+seatIndex)}"
               @click="formData.selectedSeats.negate(''+rowIndex+'-'+seatIndex); formData.selectedSeats.size=formData.selectedSeats.size;">
                    {{rowIndex+'-'+seatIndex}}
            </button>
            <button type="button" v-else class="btn disabled" disabled>
                    {{rowIndex+'-'+seatIndex}}
            </button>
         </template>
      </div>
   </div>
</div>
`
 })

Vue.component('personal-details', {
   props:["formData"],
   template: `
<div>
   <h3>Dane osobowe</h3>
   <div class="form-group">
      <label for="name">Imię</label>
      <input type="text" class="form-control" id="name" v-model="formData.name" required pattern="[A-ZŻŹĆĄŚĘŁÓŃ][a-zzżźćńółęąś]+"  placeholder="Jan">
   </div>
   <div class="form-group">
      <label for="surname">Nazwisko</label>
      <input type="text" class="form-control" id="surname" v-model="formData.surname" required pattern="[A-ZŻŹĆĄŚĘŁÓŃ][a-zzżźćńółęąś]+" placeholder="Kowalski">
   </div>
   <div class="form-group">
      <label for="email">Email</label>
      <input type="email" class="form-control" id="email" v-model="formData.email" required placeholder="jankowalski@email.pl">
   </div>
   <div class="form-group">
      <label for="number">Numer Telefonu</label>
      <input type="text" class="form-control" id="number" v-model="formData.number" required pattern="([0-9]{3} ?){3}" placeholder="000 000 000">
   </div>
</div>
`
})

Vue.component('recapitulation', {
   props:["formData", "title", "seats", "discounts", "sessions", "selectedPage", "toPay"],
   methods:{
      submit(event){
         const form=this.$refs.form;
         if(form.checkValidity()){
            this.selectedPage.index++;
         }
         form.classList.add('was-validated');
      }
   },
   template: `
<form role="form" class="form-horizontal" style="margin: 5% 5% 10%;" ref="form">
   <h1>Podsumowanie</h1>
   <hr>
   <div class="form-group">
      <label for="film">Film:</label>
      <input type="text" class="form-control" id="film" v-bind:value="title" readonly>
   </div>
   <div class="form-group">
      <label for="formData.session">Seans:</label>
      <select v-model="formData.session" class="form-control" id="session">
         <option v-for="s in sessions">{{s}}</option>
      </select>
   </div>
   <seat-selection :form-data="formData" :seats="seats"></seat-selection>
   <div class="form-group">
      <label for="discount">Zniżka:</label>
      <select class="form-control" id="discount" v-model="formData.discount">
         <option v-for="d in discounts" v-bind:value="d">{{d.toString()}}</option>
      </select>
   </div>
   <h3>Do zapłaty:</h3>
   <p>{{formData.selectedSeats.size}}x20zł<br>
      <span v-if="formData.discount.value>0">-{{formData.discount.value}}%<br></span>=>
      <span class="font-weight-bold">{{toPay}}zł</span></p>
   <hr>
   <personal-details :form-data="formData"></personal-details>
   <hr>
   <button type="button" class="btn btn-primary float-left" @click="selectedPage.index--">Powrót</button>
   <button type="button" class="btn btn-primary float-right"  @click="submit">Zatwierdź</button>
</form>
`
});

class Discount {
   constructor(name, value){
      this.name=name;
      this.value=value;
   }
   toString(){
     return `${this.name} (${this.value}%)`;
   }
}
Discount.empty=new Discount("brak", 0);

function objectMap(object, callbackFn) {
   return Object.keys(object).reduce(function(result, key) {
     result[key] = callbackFn(object[key], key)
     return result
   }, {})
}

const app = new Vue({
   el: '#main',
   data: {
      selectedPage:{index:0},
      title:"",
      seats:[],
      sessions:[],
      discounts:[
         Discount.empty,
         new Discount("student", 20),
         new Discount("weteran", 30),
         new Discount("emeryt", 40)
      ],
      basePrice:20,
      formData:{
         session:"",
         // normal Set couldn't be used because it isn't supported by Vue's reactivity system
         selectedSeats:{
            size:0,
            has(key) { return this[key]; },
            negate(key) {
               if(this[key]){
                  this.size--;
                  this[key]=false;
               } else {
                  this.size++;
                  Vue.set(this, key, true);
               }
            }
         },
         discount:Discount.empty,
         name:"",
         surname:"",
         email:"",
         number:"",
      }
   },
   computed:{
      toPay(){
         const withoutDiscount=this.formData.selectedSeats.size*this.basePrice;
         return withoutDiscount-withoutDiscount*(this.formData.discount.value/100);
      }
   },
   async mounted() {
      const url="http://localhost:5000/movie";
      const response = await fetch(url, {
         method: 'POST',
         mode: 'cors',
         cache: 'no-cache',
         credentials: 'same-origin',
         headers: {
           'Content-Type': 'application/json'
         },
         redirect: 'follow',
         referrer: 'no-referrer',
         body: JSON.stringify({"movie":"78483421"})
      });
      const data=await response.json();
      // change rows from arrays of objects {index : isOccupied} to maps index=>isOccupied
      this.seats=objectMap(data.arrangement, row=>
        row.reduce((result, element)=>{
           const firstField=Object.keys(element)[0];
           result[firstField]=element[firstField]==1;
           return result;
        }, {})
      );
      this.title=data.title;
      this.sessions=data.sessions.map(timestamp=>new Date(timestamp*1000).toLocaleString());
      this.formData.session=this.sessions[0];
   },
});
