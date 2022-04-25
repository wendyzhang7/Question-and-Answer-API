const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 8000
const db = require('./queries.js')
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/qa/:id', db.getQA);
app.get('/qa/:question_id/answers', db.getSpecificAnswers);
app.post('/qa/:id', db.askQuestion);
app.post('/qa/:question_id/answers', db.answerQuestion);

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})