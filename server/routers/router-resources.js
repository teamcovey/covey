const Resource = require('../models/resource.js');
const Resources = require('../collections/resources.js');
const knex = require('../config/config.js').knex;

exports.addResource = (req, res) => {
  const name = req.body.name;
  const quantity = req.body.quantity;
  const type = req.body.type;
  const coveyId = req.body.coveyId;

  Resources.create({
    name,
    quantity,
    type,
    covey_id: coveyId,
  })
  .then((resource) => {
    res.status(201).json({ resource, success: true });
  })
  .catch((err) => {
    res.status(404).json(err);
  });
};

exports.updateResource = (req, res) => {
  const resourceId = req.params.resourceId;

  const name = req.body.name;
  const quantity = req.body.quantity;
  const type = req.body.type;
  const coveyId = req.body.coveyId;

  Resource.where({ id: resourceId })
    .fetch()
    .then((resource) => {
      resource.set('name', name);
      resource.set('quantity', quantity);
      resource.set('type', type);
      resource.set('coveyId', coveyId);
      resource.save()
        .then((updatedResouce) => {
          res.status(201).send({ updatedResouce });
        });
    })
  .catch((err) => {
    res.status(404).json(err);
  });
};

exports.removeResource = (req, res) => {
  const resourceId = req.params.resourceId;

  // we will remove the join tables that have the user_id in them
  knex('resources_users')
    .where('resource_id', resourceId)
    .del()
    .then((affectedRows) => {
      console.log('deleted rows were: ', affectedRows);
    })
    .catch((err) => {
      console.log('error in deleting resources_users rows: ', err);
    });

  new Resource({ id: resourceId })
    .destroy()
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

exports.getAllSuppliers = (req, res) => {
  const resourceId = req.params.resourceId;

  knex.from('users')
    .innerJoin('resources_users', 'users.id', 'resources_users.user_id')
    .where('resource_id', '=', resourceId)
    .then((suppliers) => {
      res.status(200).json(suppliers);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

exports.getAllResources = (req, res) => {
  const coveyId = req.params.coveyId;

  knex.from('resources')
    .innerJoin('resources_users', 'resources.id', 'resources_users.resource_id')
    .innerJoin('users', 'users.id', 'resources_users.user_id')
    .where('covey_id', '=', coveyId)
    .then((resources) => {
      res.status(200).json(resources);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

exports.removeSupplier = (req, res) => {
  const resourceId = req.params.resourceId;
  const userId = req.params.userId;

  knex('resources_users')
    .where('user_id', userId)
    .andWhere('resource_id', resourceId)
    .del()
    .then((affectedRows) => {
      console.log('deleted rows were: ', affectedRows);
      res.json({ success: true });
    })
    .catch((err) => {
      console.log('error in deleting resources_users rows: ', err);
      res.status(404).json(err);
    });
};

exports.addSupplier = (req, res) => {
  const resourceId = req.params.resourceId;
  const userId = req.params.userId;

  knex('resources_users')
      .returning('resource_id')
      .insert({ user_id: userId, resource_id: resourceId })
  .then((resourceIs) => {
    res.status(201).json({ id: resourceIs[0], success: true });
  })
  .catch((err) => {
    res.status(404).json(err);
  });
};
