const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: '3.21.220.168',
  database: 'qa',
  password: '12345',
  port: 5432,
});

const getQA = (request, response) => {
  const id = parseInt(request.params.id);
  // console.log('req at getQA', request);
  var queryStr = `select jsonb_agg(results) from (select jsonb_build_object('question_id', id, 'question_body', body, 'question_date', date_written, 'asker_name', asker_name, 'question_helpfullness', helpful, 'reported', reported,
  'answers', jsonb_agg(allanswers)
) as results
from ( select A.*, jsonb_build_object(B.id, jsonb_build_object('id', B.id, 'body', B.body, 'date', B.date_written, 'answerer_name', B.answerer_name, 'helpfulness', B.helpful)) as allanswers

from questions A
inner join answers B
on A.id = B.question_id

where A.product_id = $1) k
group by id, body, date_written, asker_name, helpful, reported
) m
 `;

  pool.query(queryStr, [id], (error, results) => {
    if (error) {
      throw error;
      response.status(404).send('error at getquestino')
    }

    var newResults = results.rows[0].jsonb_agg;
    var answers = results.rows[0].jsonb_agg[0].answers;
    var answerObj = {};

    answers.forEach((element, index) => {
      for (var property in element) {
        answerObj[property] = element[property];
      }
      newResults[index].answers = answerObj;
    })

    // newResults[answers] = answerObj;
    var test = {
      product_id: id,
      results: newResults
    };

    response.status(200).json(test)
    // console.log('answerObj', answerObj);
    // console.log('newResults', newResults);
    // console.log('results', results.rows);
  })
}


const getSpecificAnswers = (request, response) => {
  const question_id = parseInt(request.params.question_id);
  var queryStr = `select jsonb_agg(results) from (select jsonb_build_object('answer_id', id, 'body', body, 'date', date_written, 'answerer_name', answerer_name, 'helpfullness', helpful,
  'photos', jsonb_agg(alphotos)
) as results

from ( select A.*, jsonb_build_object('id', B.id, 'url', B.url ) as alphotos

from answers A
inner join answers_photos B
on A.id = B.answer_id

where A.question_id = $1) k
group by id, body, date_written, answerer_name, helpful) m
 `;

  pool.query(queryStr, [question_id], (error, results) => {
    // console.log('results', results.rows);
    if (error) {
      throw error;
      response.status(404).send('error at getanswer');
      // console.log('err at getanswer', error);
    }
    var newResult = results.rows[0].jsonb_agg;
    if (newResult) {
      newResult.forEach((element, index) => {
        // console.log(element.date);
        var formattedDate = new Date(Number(element.date));
        element.date = formattedDate;
      })
    }

    var output = {
      question: question_id,
      results: newResult || [],
    }
    // console.log(new Date(Number(results.rows[0].jsonb_agg[0].date)))

    response.status(200).json(output);
    // console.log('answerObj', answerObj);
    // console.log('newResults', newResults);
    // console.log('newResult', newResult);
  })
}

const askQuestion = (request, response) => {
  const {body, name, email, product_id} = request.body;

  pool.query('INSERT INTO users (body, name, email, product_id) VALUES ($1, $2, $3, $4)', [body, name, email, product_id], (error, results) => {
    if (error) {
      throw error;
      response.status(404).send('error at askQuestion');
    }
    response.status(201).send(`Question added with ID: ${results.insertId}`)
  })

}

const answerQuestion = (request, response) => {
  const {body, name, email, photos, product_id} = request.body;

  pool.query('INSERT INTO users (body, name, email, photos, product_id) VALUES ($1, $2, $3, $4, $5)', [body, name, email, photos, product_id], (error, results) => {
    if (error) {
      throw error;
      response.status(404).send('error at answerQuestion');
    }
    response.status(201).send(`Answered added with ID: ${results.insertId}`)
  })

}

module.exports = {
  getQA,
  getSpecificAnswers,
  askQuestion,
  answerQuestion,
  // markQAsHelpful,
  // reportQuestion,
  // markAnsAsHelpful,
  // reportAns
}