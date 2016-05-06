angular.module('covey.supplies')
.service('suppliesHelpers', function ($routeParams) {
  this.getUsersSupplies = (supplies, userId) => {
    const usersSupplies = [];

    // iterate over all supplies
    supplies.forEach((supply) => {
      // find user in list of suppliers
      supply.suppliers.forEach((supplier) => {
        if (supplier.id === userId) {
          usersSupplies.push(supply);
        }
      });
    });

    return usersSupplies;
  };

  /* Convert a single user's list of assigned supplies into a string list of supply names */
  this.suppliesToString = (supplies) => {
    if (supplies.length) {
      return supplies.reduce((prev, curr) => {
        return { name: `${prev.name}, ${curr.name}` };
      }, { name: '' });
    } else {
      return 'My Supplies.';
    }
  };

  /* Returns supply name if current user is a supplier */
  this.findUsersSupplies = (suppliers, supply, userId) => {
    let supplies = 'no supplies.';
    suppliers.forEach((supplier) => {
      if (supplier.user_id === userId) {
        supplies = supply.name;
      }
    });
    return supplies;
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
    const dummySuppliesData = [
      {
        id: 1,
        name: 'The Precious',
        quantity: 8,
        type: 'gear',
        covey_id: 1,
        suppliers: [
          {
            id: 5,
            facebookId: 'tsgFullTest',
            firstName: 'Merry',
            lastName: 'Baggins',
            email: 'tsg@me.com',
            gender: 'male',
            photoUrl: 'http://something.com/nope.jpg',
            phoneNumber: null,
            accessToken: null,
            refreshToken: null,
            user_id: 5,
            resource_id: 1,
          },
          {
            id: 7,
            facebookId: 'tsgFullTest',
            firstName: 'Gandalf',
            lastName: 'Wizard',
            email: 'tsg@me.com',
            gender: 'male',
            photoUrl: 'http://something.com/nope.jpg',
            phoneNumber: null,
            accessToken: null,
            refreshToken: null,
            user_id: 7,
            resource_id: 1,
          },
        ],
      },
      {
        id: 2,
        name: 'Leven Bread',
        quantity: 11,
        type: 'food',
        covey_id: 1,
        suppliers: [
          {
            id: 5,
            facebookId: 'tsgFullTest',
            firstName: 'Merry',
            lastName: 'Baggins',
            email: 'tsg@me.com',
            gender: 'male',
            photoUrl: 'http://something.com/nope.jpg',
            phoneNumber: null,
            accessToken: null,
            refreshToken: null,
            user_id: 5,
            resource_id: 1,
          },
        ],
      },
    ];

    return $http.get(`/api/resources/${$routeParams.coveyId}`)
    .then((supplies) => dummySuppliesData, (error) => {
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

  // TODO: create endpoint for updating a supply
  this.updateSupply = (supply) => {
    return $http.put(`/api/resources/${supply.id}`, supply)
    .then((updatedSupply) => updatedSupply, (error) => {
      console.error(error);
    });
  };

  this.removeSupply = (supplyId) => {
    return $http.delete(`/api/resources/${supplyId}`)
    .then((response) => response, (error) => {
      console.error(error);
    });
  };

  this.addSupplier = (supplyId, supplierId) => {
    return $http.post(`/api/suppliers/${supplyId}/${supplierId}`, {})
    .then((supply) => supply.data, (error) => {
      console.error(error);
    });
  };

  this.removeSupplier = (supplyId, supplierId) => {
    return $http.delete(`/api/suppliers/${supplyId}/${supplierId}`)
    .then((response) => response, (error) => {
      console.error(error);
    });
  };
});
