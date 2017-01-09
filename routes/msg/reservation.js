var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var mysql = require('mysql');

var conn = mysql.createConnection({
	host      : config.rds.host,
	user      : config.rds.user,
	password  : config.rds.password,
	database  : config.rds.msgdatabase
});

conn.connect();

/******************************
 *          route             *
 ******************************/
router.post(['/'], function(req, res, next){
	var mappingId = req.body.mappingId;
	var time = req.body.time;
	var content = req.body.content;

	console.log("mappingId : " + mappingId + ", time : " + time + ", content : " + content);

	var sql = "INSERT INTO RESERVED_MESSAGE (_mappingId , Time, Content) VALUES (?, ?, ?)";
	var params = [mappingId, time, content];

	conn.query(sql, params, function(error, rows, fields){
			if(error){
				console.log(error);
			}else{
				if(!rows.length){
					res.send('OK');
				}else{
					res.send('Error');
				}
			}

	});
});


/* GET home page. */
router.get(['/', '/:id'], function(req, res, next) {
	var sql = "SELECT _typeId, Time, Content FROM RESERVED_MESSAGE";

	conn.query(sql, function(error, rows, fields){
			if(error){
				console.log(error);
			}else{
				if(!rows.length){
					res.send('Error');
				}else{
					var result = "";

					for(var i=0; i<rows.length; i++){
						result += "" + rows[i]._typeId + "," + rows[i].Time + "," + rows[i].Content +"\n";
					}
					res.send(result);
				}
			}

	});
});


module.exports = router;
