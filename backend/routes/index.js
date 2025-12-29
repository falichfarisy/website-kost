var express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello bakpao');
})

app.post('/', (req, res) => {
  res.send('Got a POST request')
})

app.put('/user', (req, res) => {
  res.send('Got a PUT request at /user')
})

app.delete('/user', (req, res) => {
  res.send('Got a Delete request at /user')
})


module.exports = app;
