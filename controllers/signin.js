const handleSignin = (db, bcrypt) => (req, res)=> {
		// works with this syntax at server.js: app.post('/signin', handleSignin(db, bcrypt));
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json('incorrect form submission');
	}
	db('login')
		.select('email', 'hash')
		.where({email: email})   // or .where('email', '=', email)
		.then(loginData => {
			bcrypt.compare(password, loginData[0].hash)
				.then(bcryptResponse => {
					if (bcryptResponse) {
						return db('users')
							.select('*')
							.where({email: email})
							.then(user => {
								res.json(user[0])
							})
							.catch(err => res.status(400).json('unable to get user'))
					}	else {
						res.status(400).json('wrong credentials');
					};
				})
				.catch(err => res.status(400).json('wrong credentialss'))
		})
		.catch(err => res.status(400).json('wrong credentialsss'))
}

module.exports = {
	handleSignin: handleSignin
};

