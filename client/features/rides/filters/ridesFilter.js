/* Filters attendees data so only possible passengers
* can be displayed as options to be added to rides */

angular.module('covey.rides')
.filter('alreadyPassenger', function () {
  return _.memoize((attendees, rides) => {
    if (Array.isArray(attendees)) {
      let allPassengers = [];
      rides.forEach((ride) => {
        allPassengers = allPassengers.concat(ride.riders);
      });
      return attendees.filter((attendee) => {
        let result = true;
        allPassengers.forEach((currentPassenger) => {
          if (currentPassenger.user_id === attendee.user_id) {
            result = false;
          }
        });
        return result;
      });
    }
  });
});


//   return (attendees, rides) => {
//     let allPassengers = [];
//     rides.forEach((ride) => {
//       allPassengers = allPassengers.concat(ride.riders);
//     });
//     return attendees.filter((attendee) => {
//       let result = true;
//       allPassengers.forEach((currentPassenger) => {
//         if (currentPassenger.user_id === attendee.user_id) {
//           result = false;
//         }
//       });
//       return result;
//     });
//   };
// // The memoized filter function
// angular.module("TestApp.filters", [])
//   .filter("numbersToObjects", function(){
//       //takes an array of integers and returns an array of objects with the numbers published under the specified property
//       return _.memoize(function(numbers, propertyToPublishNumberUnder){
//         propertyToPublishNumberUnder = propertyToPublishNumberUnder || "val";
//         var objects = [], object;
//         angular.forEach(numbers, function(number, index){
//           object = {};
//           object[propertyToPublishNumberUnder] = number
//           objects.push(object);
//         });
//         return objects;  
//       });
//     //}
//   }) 