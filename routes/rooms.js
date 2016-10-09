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


/* GET home page. */
router.get(['/', '/:id'], function(req, res, next) {
  var myName = config.rds.user;
	var userid = req.params.id;
	var topicSeq = null;
	var mqtt_client = config.iot.mqttproxy;
	console.log('session : ' + req.session);

	if(userid){
	var sql = 'SELECT Rname FROM ROOM, ADMIN WHERE ROOM.Rid = ADMIN.Rid AND ADMIN.Uid = (SELECT Uid FROM USER WHERE USER.Email="' + userid +'")'; ;

	conn.query(sql, function(error, rows, fields){
					if(error){
									console.log(error);
					}else{
									var conArr = new Array();

									if(!rows.length){
													console.log("No room!");
									}else{
										console.log("Load Room ok!");
										var sRows = JSON.stringify(rows);
										var pRows = JSON.parse(sRows);

										for(var i=0; i<rows.length; i++){
											conArr[i] = rows[i].Rname;
										}

										console.log(rows[0].Rname);
										console.log(pRows);

									}

									res.render('rooms', { title: 'Place of Chatting', rooms : conArr});
					}
			});
	}else{
		res.redirect('/login');
	}

});


module.exports = router;
