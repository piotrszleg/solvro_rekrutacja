function objectMap(object, callbackFn) {
   return Object.keys(object).reduce(function(result, key) {
     result[key] = callbackFn(object[key], key)
     return result
   }, {})
}
Vue.component('page', {
   props:["index", "selectedPage", "footer"],
   template:`
   <div class="panel" v-bind:class="{enabled:index==selectedPage.index}">
      <div class="container text-center">
         <div style="margin: 10% 0% 10%;">
            <slot></slot>
            <div v-if="footer">
               <hr>
               <button v-if="index>0" class="btn btn-primary float-left" @click="selectedPage.index--">Powrót</button>
               <button class="btn btn-primary float-right" @click="selectedPage.index++">Dalej</button>
            </div>
         </div>
      </div>
   </div>
   `
});

Vue.component('seat-selection', {
   props:["formData", "seats"],
   methods:{
      setNegate(set, value) {
         if(set.has(value)){
            set.delete(value);
         } else {
           set.add(value);
         }
      }
   },
   template: `
<div class="form-group">
   <label>Miejsca:</label>
   <div class="row justify-content-center">
      <div v-for="(row, rowIndex) in seats" class="col-8 btn-group btn-group-toggle justify-content-center" data-toggle="buttons">
         <template v-for="(seat, seatIndex) in row">
            <label v-if="seat" class="btn btn-primary"
               @click="setNegate(formData.selectedSeats, ''+rowIndex+'-'+seatIndex); formData.selectedSeatsSize=formData.selectedSeats.size;">
               <input type="checkbox" :id="'seat-'+rowIndex+'-'+seatIndex" autocomplete="off">
               {{rowIndex+'-'+seatIndex}}
            </label>
            <label v-else class="btn disabled" disabled>
               <input type="checkbox" :id="'seat-'+rowIndex+'-'+seatIndex" autocomplete="off" disabled>
               {{rowIndex+'-'+seatIndex}}
            </label>
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
      <input type="text" class="form-control" id="name" v-model="formData.name" required>
   </div>
   <div class="form-group">
      <label for="surname">Nazwisko</label>
      <input type="text" class="form-control" id="surname" v-model="formData.surname" required>
   </div>
   <div class="form-group">
      <label for="email">Email</label>
      <input type="text" class="form-control" id="email" v-model="formData.email" required>
   </div>
   <div class="form-group">
      <label for="number">Numer Telefonu</label>
      <input type="text" class="form-control" id="number" v-model="formData.number" required>
   </div>
</div>
`
})

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

var app = new Vue({
   el: '#main',
   data: {
      selectedPage:{index:0},
      title:"",
      seats:[],
      sessions:[],
      discounts:[
         Discount.empty,
         new Discount("dziecko do 18 lat", 50),
         new Discount("student", 20),
         new Discount("emeryt", 30)
      ],
      basePrice:20,
      formData:{
         session:"",
         selectedSeats:new Set(),
         selectedSeatsSize:0,
         discount:Discount.empty,
         name:"",
         surname:"",
         email:"",
         number:"",
      }
   },
   computed:{
      toPay(){
         const withoutDiscount=this.formData.selectedSeatsSize*this.basePrice;
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
       this.seats=objectMap(data.arrangement,row=>
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
