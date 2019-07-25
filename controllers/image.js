const Clarifai = require('clarifai');

const app = new Clarifai.App({
	apiKey: 'e108712b85dd4d89afb81c64de341a71'
});

const handleImageAPIcelebrity = (req, res) => {
	app.models
		.predict(
			'e466caa0619f444ab97497640cefc4dc',  // CELEBRITY_MODEL
			req.body.input) // !!! must be .input, not .imageUrl --> explanation Lesson 230
		.then(data => res.json(data))
		.catch(err => res.status(400).json('unable to get info from API'))
}

const handleImageAPIdemographics = (req, res) => {
	app.models
		.predict(
			'c0c0ac362b03416da06ab3fa36fb58e3',  // DEMOGRAPHICS_MODEL
			req.body.input) // !!! must be .input, not .imageUrl --> explanation Lesson 230
		.then(data => res.json(data))
		.catch(err => res.status(400).json('unable to get info from API'))
}

const handleImageCountPUT = (req, res, db) => {
	const { id } = req.body;
	db('users')
		.where('id', '=', id)			// .where({id: id}) works as well
		.increment('entries', 1)
		.returning('entries')
		.then(count => res.json(count[0]))
		.catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
	handleImageAPIcelebrity: handleImageAPIcelebrity,
	handleImageAPIdemographics: handleImageAPIdemographics,
	handleImageCountPUT: handleImageCountPUT
}