const Pool = require('pg').Pool;
const pool = new Pool({
  user: '',
  host: 'localhost',
  database: 'postgres',
  password: '',
  port: 5432,
});

const getQA = (request, response) => {
  const id = parseInt(request.params.id);
  console.log('this is req.params.id', request.params.id);
  var queryStr = `select questions.id as question_id, questions.product_id, questions.body as question_body, questions.date_written as question_date, questions.asker_name, questions.reported, questions.helpful as question_helpfulness, answers.id as answer_id, answers.body, answers.date_written as date, answers.answerer_name, answers.helpful as helpfulness, answers_photos.id as photo_id, answers_photos.url as url
  from questions inner join answers
        on questions.id = answers.question_id
        inner join answers_photos
        on answers.id = answers_photos.answer_id
        where product_id =  $1
        order by product_id, question_id, answer_id
 `;

  pool.query(queryStr, [id], (error, results) => {
    if (error) {
      throw error;
      console.log('error at getQA', error);
    }
    console.log('this is results.rows', results.rows);
    // console.log('this is results', results);
    var test = {
        product_id:results.rows[0].product_id,
        results: [{
          question_id: 0,
          question_body: '',
          question_date: '',
          asker_name: '',
          question_helpfulness: 0,
          reported: false,
          answers: {
          }
        }]
      };

      for (var i=0; i<results.rows.length; i++) {

      }
    response.status(200).json(results.rows)
    // response.status(200).json(test)
  })
}


module.exports = {
  getQA,
}