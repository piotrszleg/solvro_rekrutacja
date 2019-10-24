function objectMap(object, mapFn) {
   return Object.keys(object).reduce(function(result, key) {
     result[key] = mapFn(object[key], key)
     return result
   }, {})
 }

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
      page:0,
      title:"",
      seats:[],
      selectedSeats:new Set(),
      selectedSeatsSize:0,
      sessions:[],
      session:"",
      discounts:[
         Discount.empty,
         new Discount("dziecko do 18 lat", 50),
         new Discount("student", 20),
         new Discount("emeryt", 20)
      ],
      discount:Discount.empty,
      basePrice:20,
      name:"",
      surname:"",
      email:"",
      number:"",
   },
   methods:{
      setNegate(set, value) {
         if(set.has(value)){
            set.delete(value);
         } else {
           set.add(value);
         }
      }
   },
   computed:{
      toPay(){
         const withoutDiscount=this.selectedSeatsSize*this.basePrice;
         return withoutDiscount-withoutDiscount*(this.discount.value/100);
      }
   },
   async mounted() {
      const url="http://localhost:5000/movie";
      const response = await fetch(url, {
         method: 'POST', // *GET, POST, PUT, DELETE, etc.
         mode: 'cors', // no-cors, *cors, same-origin
         cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
         credentials: 'same-origin', // include, *same-origin, omit
         headers: {
           'Content-Type': 'application/json'
           // 'Content-Type': 'application/x-www-form-urlencoded',
         },
         redirect: 'follow', // manual, *follow, error
         referrer: 'no-referrer', // no-referrer, *client
         body: JSON.stringify({"movie":"78483421"}) // body data type must match "Content-Type" header
       });
       const data=await response.json();
       // change rows from arrays of objects {index : isOccupied} to maps index=>isOccupied
       this.seats=objectMap(data.arrangement,row=>
         row.reduce((result, element)=>{
            const firstField=Object.keys(element)[0];
            result[firstField]=element[firstField];
            return result;
         }, {})
       );
       this.title=data.title;
       this.sessions=data.sessions.map(timestamp=>new Date(timestamp*1000).toLocaleString());
       this.session=this.sessions[0];
   },
});
