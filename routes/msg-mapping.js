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

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

conn.connect();



router.post(['/'], function(req, res, next){
	var parentId = req.body.parentId;
	var childId = req.body.childId;
	var topic = parentId + "_" + childId;

	console.log("parentId : " + parentId + ", childId : " + childId + ", Topic : " + topic);

	var sql = "SELECT _mappingId FROM MAPPING WHERE (_parentId = '" + parentId + "' AND _childId = '" + childId + "')";

	conn.query(sql, function(error, rows, fields){
					if(error){
									console.log(error);
					}else{
									if(!rows.length){
													console.log("No mapping id!");

													var sql = "INSERT INTO MAPPING (_parentId, _childId, Topic) VALUES (?, ?, ?)";
													var params = [parentId, childId, topic];

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
													console.log("Mapping");
													res.send("" + rows[0]._mappingId);
									}
					}
			});

});


/* GET home page. */
router.get(['/:userId', '/:parentId/:childId'], function(req, res, next) {
		var childId = req.params.childId;

		if(childId == undefined){
			var userId = req.params.userId;
			console.log("userId : " + userId);

			var sql = "SELECT _mappingId FROM ((SELECT * FROM MAPPING WHERE _parentId = " + userId + ") UNION (SELECT * FROM MAPPING WHERE _childId = " + userId + " )) AS x";

			conn.query(sql, function(error, rows, fields){
					if(error){
						console.log(error);
					}else{
							if(!rows.length){
								res.send("No");
							}else{
								var result = "";

								for(var i=0; i<rows.length; i++){
									result += "" + rows[i]._mappingId + "\n";
								}

								res.send(result);
							}
					}
			});
		}else{
			var parentId = req.params.parentId;

			var sql = "SELECT _mappingId FROM MAPPING WHERE (_parentId = " + parentId + " AND _childId = " + childId +")";

			conn.query(sql, function(error, rows, fields){
				if(error){
					console.log(error);
				}else{
					if(!rows.length){
						res.send("No");
					}else{
						res.send(rows[0]._mappingId);
					}
				}
			});
		}


});


module.exports = router;
