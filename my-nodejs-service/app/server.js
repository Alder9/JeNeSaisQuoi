const express = require('express');
const app = express();

const react = require('react');
const url = '';
var db;


// app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/us.json', (req, res) => {
  res.sendFile(__dirname + '/us.json');
});

app.get('/index.js', (req, res) => {
  res.sendFile(__dirname + "/index.js");
});

app.get('/resources/twomonthsample.js', (req, res) => {
  res.sendFile(__dirname + "/resources/twomonthsample.js");
});

app.get('/data-all', (req, res) => {
  res.send('Data page!');
});

app.get('/data-twitter', (req, res) => {
  
});


// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});