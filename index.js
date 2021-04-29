const express = require('express');
const app = express();

let topMovies = [
{
  title: 'Inception',
  domesticGross: '$292,944,200',
  director: 'Christopher Nolan'
},
{
  title: 'Gladiator',
  domesticGross: '$277,119,800',
  director: 'Ridley Scott'
},
{
  title: 'Good Will Hunting',
  domesticGross: '$234,953,100',
  director: 'Gus Van Scott'
},
{
  title: 'Saving Private Ryan',
  domesticGross: '$364,146,700',
  director: 'Steven Spielberg'
},
{
  title: 'Forrest Gump',
  domesticGross: '$625,223,100',
  director: 'Robert Zemeckis'
},
{
  title: 'Spotlight',
  domesticGross: '$45,055,776',
  director: 'Tom McCarthy'
},
{
  title: 'The Wolf of Wallstreet',
  domesticGross: '$116,949,183',
  director: 'Martin Scorsese'
},
{
  title: 'Django Unchained',
  domesticGross: '$162,805,434',
  director: 'Quentin Tarantino'
},
{
  title: 'The Drop',
  domesticGross: '$10,724,389',
  director: 'Michael Roskam'
},
{
  title: 'Child 44',
  domesticGross: '$1,224,330',
  director: 'Daniel Espinosa'
},
];

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my top movies!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});


// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
