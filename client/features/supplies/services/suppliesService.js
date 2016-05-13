angular.module('covey.supplies')
.service('suppliesHelpers', function ($routeParams) {
  /* Iterates through all supplies and finds the user's assigned supplies */
  this.getUsersSupplies = (supplies, userId) => {
    const usersSupplies = [];
    if (supplies) {
      supplies.forEach((supply) => {
        if (supply.suppliers) {
          supply.suppliers.forEach((supplier) => {
            if (supplier.user_id.toString() === userId.toString()) {
              usersSupplies.push(supply);
            }
          });
        }
      });
    }

    return usersSupplies;
  };

  /* Converts a single user's list of assigned supplies into a string list of supply names */
  this.suppliesToString = (supplies) => {
    if (supplies.length) {
      return supplies.reduce((prev, curr) => {
        return { name: `${prev.name}, ${curr.name}` };
      }, { name: '' });
    } else {
      return 'My Supplies.';
    }
  };

  /* Checks if a user is a current supplier assigned to a supply */
  this.isASupplier = (supply, potentialSupplier) => {
    let result = false;
    for (let i = 0; i < supply.suppliers.length; i++) {
      if (supply.suppliers[i].user_id === potentialSupplier.user_id) {
        result = true;
        break;
      }
    }
    return result;
  };

  /* Creates skeleton supply for easy user input and POSTing */
  this.newSupplyInput = () => (
    {
      name: 'add supply',
      quantity: 10,
      type: 'category',
      coveyId: $routeParams.coveyId,
      suppliers: [],
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
    .then((newSupply) => newSupply.data, (error) => {
      console.error(error);
    });
  };

  this.updateSupply = (supply) => {
    return $http.put(`/api/resources/${supply.id}`, supply)
    .then((updatedSupply) => updatedSupply, (error) => {
      console.error(error);
    });
  };

  this.removeSupply = (supplyId) => {
    return $http.delete(`/api/resources/${$routeParams.coveyId}/${supplyId}`)
    .then((response) => response, (error) => {
      console.error(error);
    });
  };

  this.addSupplier = (supplyId, supplierId) => {
    return $http.post(`/api/suppliers/${supplyId}/${supplierId}`, { coveyId: $routeParams.coveyId })
    .then((supply) => supply.data, (error) => {
      console.error(error);
    });
  };

  this.removeSupplier = (supplyId, supplierId) => {
    return $http.delete(`/api/suppliers/${$routeParams.coveyId}/${supplyId}/${supplierId}`)
    .then((response) => response, (error) => {
      console.error(error);
    });
  };
});
