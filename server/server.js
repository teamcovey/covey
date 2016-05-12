const app = require('./routers/router.js').app;
const server = require('./routers/router.js').server;

// Set port based on environment
var port = process.env.covey_env === 'PROD' ? 80 : 3000;

app.set('port', port);

server.listen(app.get('port'), () => {
  console.log('Covey app is running on port', app.get('port'));
});

module.exports = app;
