const jwt = require('jsonwebtoken');
const _ = require('lodash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const User = require('./../models/user');
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET;

var strategy = new JwtStrategy(jwtOptions, function (jwtPayload, next) {
	User.findById(jwtPayload.id).then(function (user) {
		if (user) {
			return next(null, user);
		} else {
			return next(null, false);
		}
	}).catch(function (err) {
		return next(err);
	});
});

var localStrategy = new LocalStrategy({
	usernameField: 'email',
	paswordField: 'password'
}, async (email, password, next) => {
	console.log(email, password);
	var user = await User.findOne({
		email: email
	});
	if (!user) {
		return next(null, false, {
			message: 'User not found'
		});
	}
	const validate = await user.validPassword(password);
	if (!validate) {
		return next(null, false, {
			message: 'Wrong password'
		});
	}
	return next(null, user, {
		message: 'Logged in successfully'
	});
});

passport.use(localStrategy);
passport.use(strategy);

module.exports = passport;