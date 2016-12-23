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


router.post(['/'], function(req, res, next){
	var userId = req.body.userId;
	var profile = req.body.profile;
	var sex = req.body.sex;

	console.log("userId : " + userId + ", profile : " + profile + ", sex : " + sex);

	var sql = "SELECT * FROM USER_INFO WHERE _userId = ?";
	var params = [userId];

	conn.query(sql, params, function(error, rows, fields){
		if(error){
			console.log(error);
		}else{
			if(!rows.length){
				var sql = "INSERT INTO USER_INFO (_userId, profile , sex) VALUES (?, ?, ?)";
				var params = [userId, profile, sex];

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
			}else{
				res.send('Already');
			}
		}


	});
});


/* GET home page. */
router.get(['/', '/:id'], function(req, res, next) {
	var userId = req.params.id;

	var sql = "SELECT Profile, Sex FROM USER_INFO WHERE _userId = ?";

	var params = [userId];

	var result = "";

	conn.query(sql, params, function(error, rows, fields){
			if(error){
				console.log(error);
			}else{
				for(var i=0; i<rows.length; i++){
					result = "" + rows[i].Profile + "," + rows[i].Birthday + "," + rows[i].Sex + "\n";
				}
				res.send(result);
			}

	});

});


module.exports = router;
