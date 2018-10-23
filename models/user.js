var mongoose = require('mongoose');
var validator = require('validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		sparse: true,
		validate: [
			validator.isEmail,
			"{VALUE} is not an email format"
		]
	},
	password: {
		type: String,
		required: true
	},
	first: {
		type: String
	},
	last: {
		type: String
	},
	phone: {
		type: String
	},
	name: {
		type: String
	},
	salt: {
		type: String
	}
});

userSchema.pre('save', function (next) {
	if (this.isModified('password') || this.isNew()) {
		this.salt = crypto.randomBytes(16).toString('hex');
		this.password = this.generatePassword(this.salt, this.password);
	}
	next();
});

userSchema.methods.generatePassword = function (salt, pwd) {
	return crypto.pbkdf2Sync(pwd, salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.getJWT = function () {
	var payload = {
		id: this._id
	};
	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRATION
	});
};

userSchema.statics.findByEmail = function (email) {
	var User = this;
	return User.findOne({
		email: email
	});
};

userSchema.methods.validPassword = function (pwd) {
	var hash = this.generatePassword(this.salt, pwd);
	console.log('stroed pwd', this.password, "vs", hash);
	return this.password === hash;
}

userSchema.statics.authenticate = function (jwtPayload) {
	this.find({
		email: jwtPayload.email
	}, (err, info) => {
		if (info) {
			if (info.password === this.generatePassword(this.salt, jwtPayload.password)) {
				return [null, info.getJWT()];
			}
		}
		if (err) {
			console.error(err);
			return [false, err];
		}
		return false;
	});
};

var model = mongoose.model("User", userSchema);

module.exports = model;