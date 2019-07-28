const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
// import signin from './controllers/signin';  // how to convert import/export to ES6?
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://ee07cf6a447e48e28344b00856041d26@sentry.io/1511200' });
const db = knex({
  client: 'pg',
  connection: {
		connectionString: process.env.DATABASE_URL,  //heroku postgres docs
		ssl: true,  //heroku postgres docs https://devcenter.heroku.com/articles/heroku-postgresql#connecting-in-node-js
		// host : '127.0.0.1',  // for local database
    // user : 'postgres',
    // password : 'per123',
    // database : 'smartbrain'
  }
});

app.use(Sentry.Handlers.requestHandler());
app.use(bodyParser.json())
app.use(cors());

app.get('/', (req, res) => { res.send('server is working') });
app.post('/signin', signin.handleSignin(db, bcrypt));
		// === app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res) => { profile.handleProfileGET(req, res, db) });
app.post('/imageAPIcelebrity', (req, res) => { image.handleImageAPIcelebrity(req, res) });
app.post('/imageAPIdemographics', (req, res) => { image.handleImageAPIdemographics(req, res) });
app.put('/imageCount', (req, res) => { image.handleImageCountPUT(req, res, db) });

app.use(Sentry.Handlers.errorHandler());

app.listen(process.env.PORT || 3001, () => {
	console.log(`app is running on port ${process.env.PORT}`);
});


/* 
	/ --> res = this is working
	/signin --> POST = success/fail
	/register --> POST = user
	/profile/:userId --> GET = user
	/image --> PUT --> user  (updated)
 */

// checking connection between server and database.
// db.select('*').from('users')			// this is a promise, we need .then
// 	.then(data => console.log(data));   //no json(), because we don't send it through HTTP

	{// const database = {   //only for learning, users will be stored later in a database
// 	users: [
// 		{
// 			id: 123,
// 			name: 'John',
// 			email: 'john@gmail.com',
// 			password: 'cookies',
// 			entries: 0,
// 			joined: new Date()
// 		},
// 		{
// 			id: 124,
// 			name: 'Sally',
// 			email: 'sally@gmail.com',
// 			password: 'bananas',
// 			entries: 0,
// 			joined: new Date()
// 		}
// 	]
	}
	{  // post signin  without database
	// 	if (database.users.some(user => user.email === req.body.email &&
	// 																	user.password === req.body.password)) {
	// 		res.json(database.users.filter(user => user.email === req.body.email &&
	// 																	 user.password === req.body.password)[0]);
	// 	} else {
	// 		res.status(400).json('error logging in');
	// 	}
	}
	{// post register  without database
	// database.users.push({
	// 	id: database.users[database.users.length-1].id + 1,
	// 	name: name,
	// 	email: email,
	// 	password: password,
	// 	entries: 0,
	// 	joined: new Date()
	// })
	}
	{  // get profile  without database
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
	{   // put image  without database
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

// app.get('/debug-sentry', function mainHandler(req, res) {
// 	throw new Error('My first Sentry error!');
// });


