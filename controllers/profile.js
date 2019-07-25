const handleProfileGET = (req, res, db) => {  // for future development
	const { id } = req.params;
	db.select('*').from('users').where({id: id})
		.then(user => {
			if(user.length) res.json(user[0])
			else res.json('not found');
		})
		.catch(err => res.status(400).json('Error: something wrong'))
}

module.exports = {
	handleProfileGET: handleProfileGET
}