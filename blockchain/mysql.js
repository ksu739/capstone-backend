const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'nnsgluut5mye50or.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user     : 'tnqi51giv5ki1tvk',
  password : 'f2qj8atatqlibl66',
  database : 'qffzf38aeo56prj5'
});

connection.connect();

connection.query('SELECT * from student', (error, rows, fields) => {
  if (error) throw error;
  console.log('User info is: ', rows);
});

connection.end();