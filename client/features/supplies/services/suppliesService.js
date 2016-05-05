angular.module('covey.supplies')
.service('suppliesHelpers', function ($routeParams) {
  /* Creates skeleton supply for easy user input and POSTing */
  this.newSupplyInput = () => (
    {
      name: 'add supply',
      quantity: 10,
      type: 'category',
      coveyId: $routeParams.coveyId,
    }
  );
})
.service('suppliesHttp', function ($http, $routeParams) {
  this.getAllSupplies = () => {
    return $http.get(`/api/resources/${$routeParams.coveyId}`)
    .then((supplies) => supplies.data, (error) => {
      console.error(error);
    });
  };

  this.getAllSuppliers = (supplyId) => {
    return $http.get(`/api/suppliers/${supplyId}`)
    .then((suppliers) => suppliers.data, (error) => {
      console.error(error);
    });
  };

  this.addSupply = (supply) => {
    return $http.post('/api/resources', supply)
    .then((newSupply) => newSupply, (error) => {
      console.error(error);
    });
  };

  // TODO: create endpoint for updating a supply
  this.updateSupply = (supply) => {
    return $http.put(`/api/resources/${supply.id}`, supply)
    .then((updatedSupply) => updatedSupply, (error) => {
      console.error(error);
    });
  };

  this.removeSupply = (supplyId) => {
    console.log('REMOVE DIS: ', supplyId);
    $http.delete(`/api/resources/${supplyId}`)
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
