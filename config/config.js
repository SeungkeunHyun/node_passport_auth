var env = process.env.NODE_ENV || 'development';

var config = require('./config.json');
if (config.hasOwnProperty(env)) {
	var envConfig = config[env];
	Object.keys(envConfig).forEach((key) => {
		process.env[key] = envConfig[key];
	});
}