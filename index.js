function objectMap(object, mapFn) {
   return Object.keys(object).reduce(function(result, key) {
     result[key] = mapFn(object[key], key)
     return result
   }, {})
 }

var vue_det = new Vue({
   el: '#main',
   data: {
      seats:[],
      selectedSeats:new Set(),
      hours:["13:00", "16:00"],
      hour:"",
      discounts:["brak", "dziecko do 18 lat", "student", "emeryt"],
      discount:"",
      name:"",
      surname:"",
      email:"",
      number:"",
   },
   methods:{
      setNegate: function(set, value) {
         if(set.has(value)){
            set.delete(value);
         } else {
           set.add(value);
         }
         console.log(set)
      }
   },
   mounted: async function() {
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
       // change seat {index : isOccupied} to isOccupied
       this.seats=objectMap(data.arrangement,row=>
         row.reduce((result, element)=>{
            const firstField=Object.keys(element)[0];
            result[firstField]=element[firstField];
            return result;
         }, {}));
       this.hours=data.sessions.map(timestamp=>new Date(timestamp*1000));
   },
});
