var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

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


/* GET home page. */
router.get(['/', '/:id'], function(req, res, next) {

	res.render('signup', { title: 'Place of Chatting'});

});

router.post(['/', '/:id'], function(req, res, next) {
	//console.log('email : ' + req.body.email);
	//console.log('password : ' + req.body.password);
	var uid = req.body.email;
	var pw = req.body.password

	var sql = 'SELECT * FROM USER WHERE (email = "' + uid + '" AND password = "' + pw + '")';

	conn.query(sql, function(error, rows, fields){
					if(error){
									console.log(error);
					}else{
									if(!rows.length){
													console.log("No id, Insert!");

													var sql = 'INSERT INTO USER (email, password) VALUES (?, ?)';
													var params = [uid, pw];

													conn.query(sql, params, function(err, rows, fields){
																	if(err){
																					throw err;
																	} else{
																					//console.log('rows : ', rows);
																					//console.log('fields : ', fields);
																					res.redirect('/rooms/' + uid);
																	}
												 });
									}else{
													console.log("Already have id.");
													res.redirect('/signup');
									}
					}
			});

});

module.exports = router;
