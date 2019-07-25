const handleRegister = (req, res, db, bcrypt) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		return res.status(400).json('incorrect form submission');
	}
	const saltRounds = 10;   // number of rounds by hashing; the cost of processing the data. (default - 10)
	bcrypt.hash(password, saltRounds)
	.then(function(hash) {
		db.transaction(trx => {    //we're doing this to avoid inconsistence; everything successes or nothing.
			db.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.transacting(trx)
			.then(loginEmail => {
				return db('users')
				.insert({
					name: name,
					email: loginEmail[0],
					joined: new Date()
				})
				.returning('*')
				.transacting(trx)
				.then(user => {
					res.json(user[0]);
				})
			})
			.then(trx.commit)
			.catch(trx.rollback);
		})
	})
	.catch(err => {
		res.status(400).json('oops, sth wrong')
		// error is not shown, when the same user is to be registered for the second time. By Andrei this works
	})
}

module.exports = {
	handleRegister: handleRegister
}