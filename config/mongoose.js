var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true
});

module.exports = mongoose;