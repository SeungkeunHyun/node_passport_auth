var express = require('express');
var passport = require('../middleware/passport');
var router = express.Router();
var User = require('../models/user');

router.post('/me', (req, res) => {
	res.json(req.user);
});

module.exports = router;