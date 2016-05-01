const app = require('../config/server-config.js');
const route = require('./router-helpers');
// can set up different routes for each path
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.get('/', route.getUsage);

app.get('/api/auth', route.getUser);

app.get('/api/coveys', route.getAllCoveys);

app.post('/api/coveys', route.addCovey);

app.delete('/api/coveys/:id', route.removeCovey);

app.put('/api/coveys/:id', route.updateCovey);

app.get('/api/coveys/:id', route.getCovey);

app.post('/api/signup', route.signup);

module.exports = app;
