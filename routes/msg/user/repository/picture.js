var express = require('express');
var router = express.Router();

var config = require('config.json')('./config/config.json');

var multiparty = require('multiparty');
var fs = require('fs');

var util = require('util');

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/s3_config.json');
var s3Bucket = new AWS.S3( { params: {Bucket: 'korchid'} } );

var repository_model = require('../../../../models/msg/repository.model');

var db = require('../../../../models/msg/db_action');
var db_sql = require('../../../../models/msg/sql_action');

var host = config.rds.host;
var port = config.rds.port;
var user = config.rds.user;
var password = config.rds.password;
var database = config.rds.msgdatabase;

db.connect(host, port, user, password, database, function(callback){
	if(callback == '1'){
		//console.log("DB connect ok!");
	}
});


router.post(['/'], function(req, res, next){
	repository_model.uploadProfile(req, res, "", function(error, result){
		res.send(result);
	});

});


router.get(['/:loginToken'], function(req, res, next){
  var loginToken = req.params.loginToken;
  var fileName = "live_long";

  repository_model.downloadProfile(loginToken, fileName, function(error, resultDownload){
    if(error){
      res.send(resultDownload);
    }else{
			res.writeHead(200, {'Content-Type': 'image/png'});
    	res.end(resultDownload); // Send the file data to the browser
    }
  });

});



module.exports = router;
