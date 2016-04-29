const app = require('./routers/router.js');

console.log('Covey is listening on 8080');

app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
