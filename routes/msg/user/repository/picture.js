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

	var resultObject = new Object();

	var params = {
    Key: 'Path',
		ACL:'public-read',
    Body: 'Image',
    ContentEncoding: 'jpg',
    ContentType: 'image/jpeg',
		ContentLength: ''
  };


	var form = new multiparty.Form();

  // get field name & value
  form.on('field',function(name,value){
       console.log('normal field / name = '+name+' , value = '+value);
  });

  // file upload handling
  form.on('part',function(part){
       var filename;
       var size;
       if (part.filename) {
             filename = part.filename;
             size = part.byteCount;
       }else{
             part.resume();

       }

			params.Key = "com.korchid.msg/image/profile/" + filename;

			params.Body = part;
			params.ContentLength = part.byteCount;

			 s3Bucket.putObject(params, function(err, data){
					 if (err) {
						 resultObject.upload = false;
						 resultObject.key = null;
						 resultObject.body = null;

						 console.log('Error uploading data: ', data);
					 } else {
						 resultObject.upload = true;
						 resultObject.key = params.Key;
						 resultObject.body = params.Body;



						 console.log('succesfully uploaded the image!');
					 }


					 	var resultJson = JSON.stringify(resultObject);

						res.send(resultJson);
			 });

/*
       console.log("Write Streaming file :"+filename);
       var writeStream = fs.createWriteStream('uploads/'+filename);
       writeStream.filename = filename;
       part.pipe(writeStream);

       part.on('data',function(chunk){
             console.log(filename+' read '+ chunk.length + 'bytes');
       });

       part.on('end',function(){
             console.log(filename+' Part read complete');
             writeStream.end();
       });
			 */
  });


  // all uploads are completed
  form.on('close',function(){
       //res.send(resultJson);
  });

  // track progress
  form.on('progress',function(byteRead, byteExpected){
       console.log(' Reading total  '+ byteRead + '/' + byteExpected);
  });

  form.parse(req);

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
