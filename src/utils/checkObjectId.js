const mongoose = require('mongoose');

module.exports = (idToCheck) => (req, res, next) => {
	if (!mongoose.Types.ObjectId.isValid(req.params[idToCheck]))
		return res.status(400).json({ msg: 'Invalid ID' });
	next();
};
