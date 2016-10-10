var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var mysql = require('mysql');
var conn = mysql.createConnection({
	host      : config.rds.host,
	user      : config.rds.user,
	password  : config.rds.password,
	database  : config.rds.iotdatabase
});

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();


/* GET home page. */
router.get(['/', '/:userid/:roomid'], function(req, res, next) {
	var userid = req.params.userid;
	var roomid = req.params.roomid;

	// Pi request
	res.send('TODO redirect');
	//res.redirect('http://61.83.186.235:10000');
	//res.render('camera', {title:"TEST"});
});


module.exports = router;
