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
router.get(['/', '/:id'], function(req, res, next) {
	var uuid = req.params.id;

	var sql = "SELECT Rname FROM ROOM WHERE (ROOM.Uuid='" + uuid + "')";

	conn.query(sql, function(error, rows, fields){
					if(error){
									console.log(error);
					}else{
									if(!rows.length){
													console.log("No uuid!");
									}else{
													console.log("Mapping");
													res.send(rows[0].Rname);
									}
					}
			});
});


module.exports = router;
