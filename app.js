require('./config/config.js');
var mongoose = require('./config/mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('./middleware/passport');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(passport.initialize());
var api_route = require('./routes/api_route');
app.use('/api', api_route);
//var api_secured = require('./routes/api_secured');

//app.use('/api/users', passport.authenticate('jwt', {
//	session: false
//}), api_secured);


app.listen(process.env.PORT, () => {
	console.log(`listenint at port ${process.env.PORT}`);
});