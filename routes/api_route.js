var express = require("express");
var passport = require("../middleware/passport");
var router = express.Router();
var User = require("../models/user");

router.post("/users", (req, res) => {
	User.findByEmail(req.body.email).then(user => {
		console.log("User:", user);
		if (user) {
			res.json({
				message: `Already registered with email.`
			});
		} else {
			User.create(req.body).then(user => {
				console.log(user, user.getJWT());
				res.setHeader("Authorization", user.getJWT());
				res.json({
					message: "User created successfully"
				});
			});
		}
	});
});

router.post('/users/me', passport.authenticate('jwt', {
	session: false
}), (req, res) => {
	res.json(req.user);
});

router.post('/users/auth', (req, res, next) => {
	console.log(req.body);
	passport.authenticate('local', {
		session: false
	}, (err, user, info) => {
		console.log(err, user, info);
		if (err || !user) {
			return res.status(400).json({
				message: 'login failure',
				user: user
			});
		}
		req.login(user, {
			session: false
		}, err => {
			if (err) {
				res.send(err);
			}
			const token = user.getJWT();
			res.setHeader('Authorization', token);
			res.send(info);
		});
		console.log(user);
	})(req, res);
});

module.exports = router;