var express = require('express');
var router = express.Router();

var config = require('config.json')('./config/config.json');

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

router.post(['/:loginToken'], function(req, res, next){




  res.send("OK");

});


router.get(['/:loginToken'], function(req, res, next){
  var loginToken = req.params.loginToken;
  var fileName = "live_long";

  repository_model.downloadProfile(loginToken, fileName, function(error, resultDownload){
    if(error){
      res.send(resultDownload);
    }else{
      res.send(resultDownload);
    }
  });

});



module.exports = router;
