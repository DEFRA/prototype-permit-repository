
const { Pool } = require('pg');

const pool = new Pool({
  max: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

function promiseQuery (queryString, params) {
  return new Promise((resolve, reject) => {
    query(queryString, params, (res) => {
      resolve(res);
    });
  });
}

function query (queryString, params, cb) {
  pool.query(queryString, params)
    .then((res) => {
      //      console.log(res)
      cb({data: res.rows, error: null});
    }) // brianc
    .catch(err => {
      cb({error: err.stack, data: null});
    });
}

module.exports = {

  query: promiseQuery,
  pool

};
