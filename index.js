const express = require('express');
const app = express();
morgan = require('morgan');
const bodyParser = require('body-parser'),
methodOverride = require('method-override');
uuid = require('uuid');
const cors = require('cors');
const mongoose = require('mongoose');
const Models = require('./models.js');
const { check, validationResult } = require('express-validator');
const passport = require('passport');
require('./passport');

const Movies = Models.Movie;
const Users = Models.User;

//mongoose.connect('mongodb+srv://myMoviesDBadmin:Chan123!!@mymoviesdb.mfvfn.mongodb.net/myMoviesDB?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiesTopology: true});
mongoose.connect(process.env.CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true});


app.use(express.static('public'));

app.use(morgan('common'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

//let allowedOrgins = ['http://localhost:8080', 'http://localhost:1234', 'https://my-movie-api-20123.herokuapp.com/'];

app.use(
  cors()
  );

let auth = require('./auth')(app);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my top movies!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

//create route for movies(GET)

/**
 * Get all movies
 * @method GET
 * @param {string} endpoint to fetch movies."url/movies"
 * @returns {object} -returns the movie object.
 */

app.get("/movies", passport.authenticate('jwt', { session: false }),(req,res)=> {
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

//create route for movie titles(GET)

/**
 * Get a single movie
 * @method GET
 * @param {string} -endpoint to fethc a movie."url/movies/:Title"
 * @returns {object} -returns the movie object.
 */
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }),(req,res)=>{
Movies.findOne({ Title: req.params.Title })
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});


//create route for directors by name(GET)

/**
 * Get director
 * @method GET
 * @param {string} -endpoint to fetch director."url/directors/:Name"
 * @returns {object} -returns the director object.
 */

app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: false }),(req,res)=>{
  Movies.findOne({ 'Director.Name': req.params.Name})
    .then((movie) =>{
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//Return data about a genre (description) by name/title (e.g., "Action")

/**
 * Get genre 
 * @method GET
 * @param {string} -endpoint to fetch genre."url/movies/genre/:Name"
 * @returns {object} -returns the genre object.
 */

app.get('/movies/genre/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
	Movies.findOne({'Genre.Name': req.params.Name})
	.then((movie) => {
		res.json(movie.Genre);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' +err);
	});
});

/**
 * Get user
 * @method GET
 * @param {string} -endpoint to fetch user."url/users"
 * @returns {object} -returns the user object.
 */

app.get('/users', passport.authenticate('jwt', { session: false }), function(req,res) {
  Users.find()
    .then(function(users) {
        res.status(201).json(users);
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get a user by username

/**
 * Get user by username
 * @method GET
 * @param {string} -endpoint to fetch user by username."url/users/:Username"
 * @returns {object} -returns user by username
 */

app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Add a user
/* We???ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/

/**
 * Add a user
 * @method post
 * @param {integer} ID
 * @param {string} username
 * @param {string} Password
 * @param {string} Email
 * @param {Date} Birthday
 * @returns {object} -returns user object
 */

app.post('/users',
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required').isLength({min: 3}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });


// Update a user's info, by username
/* We???ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/

/**
 * Update user
 * @method put
 * @param {string} username
 * @param {string} Password
 * @param {string} Email
 * @param {date} Birthday
 * @returns {object} -returns user object
 */

app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Delete a user by username

/**
 * Delete a user by username
 * @method Delete
 * @param {string} username
 * @returns {string} - returns message user was deleted
 */

app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Remove movie from users favorites
 * @method delete 
 * @param {string} Username
 * @param {string} Password
 * @param {string} MovieID 
 * @returns {object} -returns user object
 */

//Remove a movie from a user's list of favorites
app.delete('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.findOneAndUpdate({Username: req.params.Username},
       		 { $pull: { FavoriteMovies: req.params.MovieID} },
                 {new: true},
                 (err, updatedUser) => {
                        if (err) {
	                        console.error(err);
	                        res.status(500).send('Error: ' + err);
			} else { res.json(updatedUser);
	                }
	        });
});

// Add a movie to a user's list of favorites

/**
 * Add a movie to users favorites
 * @method post
 * @param {string} Username 
 * @param {string} Password
 * @param {string} MovieID
 * @returns {string} -returns user object
 */

app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});


// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
