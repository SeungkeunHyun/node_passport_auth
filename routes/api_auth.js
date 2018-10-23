var express = require('express');
var passport = require('../middleware/passport');
var router = express.Router();
var User = require('../models/user');

router.post("/signup", (req, res) => {
	User.findByEmail(req.body.email).then((user) => {
		console.log('User:', user);
		if (user) {
			res.json({
				message: `Already registered with email.`,
			});
		} else {
			User.create(req.body).then(user => {
				console.log(user, user.getJWT());
				res.setHeader('Authorization', user.getJWT());
				res.json({
					message: "User created successfully"
				});
			});
		}
	});
});

module.exports = router;