var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var mysql = require('mysql');
var conn = mysql.createConnection({
	host      : config.rds.host,
	user      : config.rds.user,
	password  : config.rds.password,
	database  : config.rds.ajouiotdb
});

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

conn.connect();


/* GET home page. */
router.get(['/', '/:userid'], function(req, res, next) {
	var userid = req.params.userid;

	res.render('register', { title: 'Place of Chatting', userid:userid});
});



router.post(['/', '/:userid/:roomid'], function(req, res, next) {
	var userid = req.params.userid;
	var roomid = req.params.roomid;

	var uuid = req.body.uuid;
	var roomid = req.body.roomid;

	console.log('UUID : ' + uuid);
	console.log('Room ID : ' + roomid);


	var sql = "SELECT * FROM ROOM WHERE ROOM.Rname='" + roomid + "'";

	conn.query(sql, function(error, rows, fields){
					if(error){
									console.log(error);
					}else{
									if(!rows.length){
													console.log("No id, Insert!");

													var sql = "SELECT * FROM ROOM WHERE ROOM.Uuid='" + uuid + "'";

													conn.query(sql, function(error, rows, fields){
															if(error){
																	console.log(error);
															}else{
																	if(!rows.length){
																			console.log("No id, Insert!");
																			//console.log(fields);
																			//console.log(rows);
																			var sql = 'INSERT INTO ROOM (Rname, Uuid) VALUES (?, ?)';
																			var params = [roomid, uuid];

																			conn.query(sql, params, function(err, rows, fields){
																							if(err){
																											throw err;
																							} else{
																											console.log('rows : ', rows);
																											console.log('fields : ', fields);
																											console.log('Create Room ok!');

																											var sql = "SELECT Rid FROM ROOM WHERE ROOM.Uuid='" + uuid + "'";

																											conn.query(sql, function(err, rows, fields){
																															if(err){
																																			throw err;
																															} else{
																																			//console.log('rows : ', rows);
																																			//console.log('fields : ', fields);

																																			if(!rows.length){

																																			}else{
																																					var sRows = JSON.stringify(rows);
																																					var pRows = JSON.parse(sRows);
																																					console.log(pRows[0].Rid);

																																					var pRid = pRows[0].Rid;

																																					var sql = "SELECT Uid FROM USER WHERE USER.Email='" + "asdf" + "'";

																																					conn.query(sql, function(err, rows, fields){
																																									if(err){
																																													throw err;
																																									} else{
																																													//console.log('rows : ', rows);
																																													//console.log('fields : ', fields);

																																													if(!rows.length){
																																															console.log('No data.');

																																													}else{
																																															var sRows = JSON.stringify(rows);
																																															var pRows = JSON.parse(sRows);
																																															console.log(pRows[0].Uid);

																																															var pUid = pRows[0].Uid;

																																															// var sql = 'INSERT INTO ROOM (Aid, Uid, Rid) VALUES (?, ?, ?)';
																																															// var params = [Math.random() * 10000, pUid, pRid];
																																															//
																																															// console.log(params);
																																															//
																																															// conn.query(sql, params, function(err, rows, fields){
																																															// 		if(err){
																																															// 			throw err;
																																															// 		}else{
																																															// 			res.send('Register complete!');
																																															// 		}
																																															//
																																															// });
																																													}
																																									}
																																				 });


																																			}
																															}
																										 });


																							}
																		 });




																	}else{
																			res.send('Already have uuid.');
																	}
															}


													});

									}else{
													console.log("Already have id.");
													res.send('Already have room id.');
									}
					}
			});

});

module.exports = router;
