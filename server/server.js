const app = require('./routers/router.js');

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), () => {
  console.log('Covey app is running on port', app.get('port'));
});

module.exports = app;
