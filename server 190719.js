const express = require('express');
const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const app = express();

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'per123',
    database : 'smartbrain'
  }
});

// checking connection between server and database.
// db.select('*').from('users')			// this is a promise, we need .then
// 	.then(data => console.log(data));   //no json(), because we don't send it through HTTP


const database = {   //only for learning, users will be stored later in a database
	users: [
		{
			id: 123,
			name: 'John',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{
			id: 124,
			name: 'Sally',
			email: 'sally@gmail.com',
			password: 'bananas',
			entries: 0,
			joined: new Date()
		}
	]
}

app.use(bodyParser.json())
app.use(cors());

app.get('/', (req, res) => {
	res.send(database.users);
})

app.post('/signin', (req, res) => {
	const { email, password} = req.body;

})


// {
// 	if (database.users.some(user => user.email === req.body.email &&
// 																	user.password === req.body.password)) {
// 		res.json(database.users.filter(user => user.email === req.body.email &&
// 																	 user.password === req.body.password)[0]);
// 	} else {
// 		res.status(400).json('error logging in');
// 	}
// })

app.post('/register', (req, res) => {
	const { name, email, password } = req.body;
	db('users')
		.returning('*')   // KNEX method
		.insert({
			name: name,
			email: email,
			joined: new Date()
		})
			.then(user => {
				res.json(user[0]);
			})
		.catch(err => res.status(400).json('unable to register'));
})
					{// before database
						// database.users.push({
						// 	id: database.users[database.users.length-1].id + 1,
						// 	name: name,
						// 	email: email,
						// 	password: password,
						// 	entries: 0,
						// 	joined: new Date()
						// })
					}

app.get('/profile/:id', (req, res) => {  // for future development
	const { id } = req.params;
	db.select('*').from('users').where({id: id})
		.then(user => {
			if(user.length) res.json(user[0])
			else res.json('not found');
		})
		.catch(err => res.status(400).json('Error: something wrong'))
})

						{  // without database
						// 	const { id } = req.params;   // here .PARAMS --> if you have the route /user/:name, then the “name” property is available as req.params.name.
						// 	let found = false;
						// 	database.users.forEach(user => {
						// 		if (user.id === id) {
						// 		found = true;
						// 		return res.json(user);
						// 		}	
						// 	});
						// 	if (!found) {
						// 		res.status(404).json('no such user');
						// 	}
						}

app.put('/image', (req, res) => {
	const { id } = req.body;
	db('users')
		.where('id', '=', id)			// .where({id: id}) works as well
		.increment('entries', 1)
		.returning('entries')
		.then(count => res.json(count[0]))
		.catch(err => res.status(400).json('unable to get entries'))
})

						{   // without database
							// const { id } = req.body;   // here .BODY
							// let found = false;
							// database.users.forEach(user => {
							// 	if (user.id === id) {
							// 	found = true;
							// 	user.entries ++;
							// 	return res.json(user.entries);
							// 	}	
							// });
							// if (!found) {
							// 	res.status(404).json('no such user');
							// }
						}

app.listen(3001, () => {
	console.log('app is running on port 3001');
});


/* 
	/ --> res = this is working
	/signin --> POST = success/fail
	/register --> POST = user
	/profile/:userId --> GET = user
	/image --> PUT --> user  (updated)



 */