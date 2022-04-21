const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 8000
const db = require('./queries.js')

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/qa/:id', db.getQA);


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})