var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var mysql = require('mysql');
var conn = mysql.createConnection({
	host      : config.rds.host,
	user      : config.rds.user,
	password  : config.rds.password,
	database  : config.rds.webdatabase
});

conn.connect();

/* GET home page. */
router.get(['/', '/:id'], function(req, res, next) {
  var myName = config.rds.user;
	var topicId = req.params.id;
	var topicSeq = -1;

  var sql = 'SELECT id, title, description FROM topic WHERE author = (SELECT id FROM user WHERE name ="' + myName + '")';

  conn.query(sql, function(err, rows, fields){
  	if(err){
  		console.log(err);
  	}else{
  		if(!rows.length){
  			console.log("Missing DB data.");
  		}else{
				var sRows = JSON.stringify(rows);
				var pRows = JSON.parse(sRows);

				for(var i = 0; i < rows.length; i++){
					if(rows[i].id == topicId){
							topicSeq = i;
					}
				}

				if(topicSeq < 0){
					//res.send("Wrong topics.");
					res.redirect('/');
				}else{
					res.render('topics', { title: 'KYM coms', rows: pRows, seq: topicSeq });
				}
			}
		}
  });

});

module.exports = router;
