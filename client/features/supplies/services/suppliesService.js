angular.module('covey.supplies')
.service('suppliesHelpers', function () {
  /* Helper method to display the supplies that
     the current user is responsible for: */
  this.getUsersSupplies = (supplies, user) => {
    let responsibilities = '';
    for (let i = 0; i < supplies.length; i++) {
      if (supplies[i].suppliers.indexOf(user) > -1) {
        responsibilities += `${supplies[i].supplyName}, `;
      }
    }
    return responsibilities.slice(0, -2);
  };
})
.service('suppliesHttp', function ($http) {
  this.getAllSupplies = (coveyId, attendees) => {
    // return $http.get(`/resources/${coveyId}`)
    // .then((supplies) => supplies, (error) => {
    //   console.error(error);
    // });

    return [
      {
        id: 1, covey_id: coveyId, supplyName: 'Beer', suppliers: [attendees[2], attendees[0]],
      },
      {
        id: 2, covey_id: coveyId, supplyName: 'Chips', suppliers: [attendees[2]],
      },
    ];
  };

  this.addSupply = (supply) => {
    $http.post('/resources', supply)
    .then((newSupply) => newSupply, (error) => {
      console.error(error);
    });
  };

  this.removeSupply = (supplyId) => {
    $http.delete(`/resources/${supplyId}`)
    .then((response) => response, (error) => {
      console.error(error);
    });
  };

  this.addSupplier = (supplyId, supplier) => {
    $http.post(`/resources/${supplyId}`, supplier)
    .then((supply) => supply, (error) => {
      console.error(error);
    });
  };

  this.removeSupplier = (supplyId, supplier) => {
    $http.delete(`/resources/${supplyId}/${supplier.id}`)
    .then((response) => response, (error) => {
      console.error(error);
    });
  };
});
