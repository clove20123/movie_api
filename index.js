const express = require('express');
const app = express();
morgan = require('morgan');
const bodyParser = require('body-parser'),
methodOverride = require('method-override');
uuid = require('uuid');

let topMovies = [
{
  title: 'Inception',
  genre: 'science fiction',
  director: 'Christopher Nolan'
},
{
  title: 'Gladiator',
  genre: 'action',
  director: 'Ridley Scott'
},
{
  title: 'Good Will Hunting',
  genre: 'drama',
  director: 'Gus Van Scott'
},
{
  title: 'Saving Private Ryan',
  genre: 'action',
  director: 'Steven Spielberg'
},
{
  title: 'Forrest Gump',
  genre: 'comedy-drama',
  director: 'Robert Zemeckis'
},
{
  title: 'Spotlight',
  genre: 'drama',
  director: 'Tom McCarthy'
},
{
  title: 'The Wolf of Wallstreet',
  genre: 'comedy-drama',
  director: 'Martin Scorsese'
},
{
  title: 'Django Unchained',
  genre: 'action',
  director: 'Quentin Tarantino'
},
{
  title: 'The Drop',
  genre: 'drama',
  director: 'Michael Roskam'
},
{
  title: 'Child 44',
  genre: 'thriller',
  director: 'Daniel Espinosa'
},
];

let directors = [
  {
    name: 'Christopher Nolan'
  },

  {
    name: 'Ridley Scott'
  },

  {
    name: 'Gus Van Scott'
  },

  {
    name: 'Steven Spielberg'
  },

  {
    name: 'Robert Zemeckis'
  },

  {
    name: 'Tom McCarthy'
  },

  {
    name: 'Martin Scorsese'
  },

  {
    name: 'Quentin Tarantino'
  },

  {
    name: 'Michael Roskam'
  },

  {
    name: 'Daniel Espinosa'
  }
];

let genre = [
  {
    category: 'science fiction'
  },

  {
    category: 'action'
  },

  {
    category: 'drama'
  },

  {
    category: 'comedy-drama'
  },

  {
    category: 'thriller'
  }
];

app.use(express.static('public'));

app.use(morgan('common'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

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
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

//create route for movie titles(GET)
app.get('/movie/:title',(req,res)=>{
  res.json(topMovies.find((movie)=>{
    return movie.title === req.params.title
  }));
})

//create route for directors(GET)
app.get('/directors',(req,res)=>{
  res.json(directors);
})

//create route for directors by name(GET)
app.get('/directors/:name',(req,res)=>{
  res.json(directors.find((director)=>{
    return director.name === req.params.name
  }));
})

//create route for genre(GET)
app.get('/genre',(req,res)=>{
  res.json(genre);
})

//add user (POST)
app.post('/users/',(req,res)=>{
  res.send('user added');
})

//remove user (DELETE)
app.delete('/users/:username',(req,res)=>{
  res.send('user deleted');
})

//create route for user favorites (GET)
app.get('/users/:username/favorites',(req,res)=>{
  res.send('users favorites');
})

//add list of favorites (POST)
app.post('/users/:username/favorites',(req,res)=>{
  res.send('add list of favorites');
})

//remove from favorites (DELETE)
app.delete('/users/:username/favorites/:movieID',(req,res)=>{
  res.send('removed from favorites');
})

//create route for watchlist (GET)
app.get('/users/:username/favorites/watchlist',(req,res)=>{
  res.send('all movies on watchlist');
})

//add movie to favorites (POST)
app.post('/users/:username/favorites/watchlist/:movieID',(req,res)=>{
  res.send('add to favorites');
})

//remove from watchlist (DELETE)
app.delete('/users/:username/favorites/watchlist/:movieID',(req,res)=>{
  app.send('delete from watchlist');
})

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
