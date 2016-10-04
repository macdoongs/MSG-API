var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var util = require('util');

var mqtt = require('mqtt');

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

var sh_timer = require('./timer');



/* GET home page. */
router.get(['/', '/:id'], function(req, res, next) {

	res.render('register', { title: 'AjouIoT'});
});



router.post(['/', '/:id'], function(req, res, next) {
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
													// TODO create USER
													/*
													var sql = 'INSERT INTO ROOM (Rname, Uuid) VALUES (?, ?)';
													var params = [roomid, uuid];

													conn.query(sql, params, function(err, rows, fields){
																	if(err){
																					throw err;
																	} else{
																					//console.log('rows : ', rows);
																					//console.log('fields : ', fields);
																					console.log('Create Room ok!');
																	}
												 });

													*/

													/*
													var sql = 'INSERT INTO ROOM (Rname, Uuid) VALUES (?, ?)';
													var params = [roomid, uuid];

													conn.query(sql, params, function(err, rows, fields){
																	if(err){
																					throw err;
																	} else{
																					//console.log('rows : ', rows);
																					//console.log('fields : ', fields);
																					console.log('Create Room ok!');
																	}
												 });
												 */

												 // TODO Create ADMIN

												 /*
												 var sql = 'INSERT INTO ADMIN (Uid, Rid) VALUES (?, ?)';
												 var params = [roomid, uuid];

												 conn.query(sql, params, function(err, rows, fields){
																 if(err){
																				 throw err;
																 } else{
																				 //console.log('rows : ', rows);
																				 //console.log('fields : ', fields);
																				 console.log('Create Room ok!');
																 }
												});
												*/

												 res.send('TODO');
									}else{
													console.log("Already have id.");
													res.redirect('/register');
									}
					}
			});

});

module.exports = router;
