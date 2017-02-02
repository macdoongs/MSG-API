
var db_sql = require('./sql_action');

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/s3_config.json');
var s3Bucket = new AWS.S3( { params: {Bucket: 'korchid'} } );


var multiparty = require('multiparty');
var fs = require('fs');

var util = require('util');

exports.uploadProfile = function(req, res, loginToken, callback){
  console.log("uploadProfile");

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

						callback(null, resultJson);
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

  });

  // track progress
  form.on('progress',function(byteRead, byteExpected){
       console.log(' Reading total  '+ byteRead + '/' + byteExpected);
  });

  form.parse(req);

};

exports.downloadProfile = function(loginToken, fileName, callback){
  console.log("downloadProfile");

  var resultObject = new Object();

  var params = {
    Key: 'Path',
  };

  params.Key = "com.korchid.msg/image/profile/" + fileName + ".png";

  s3Bucket.getObject(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred

      resultObject.download = false;
      resultObject.key = null;
      resultObject.body = null;

      var resultJson = JSON.stringify(resultObject);

      callback(true, resultJson);

    } else{
      console.log(data);           // successful response

      resultObject.download = true;
      resultObject.key = params.Key;
      resultObject.body = data.Body;

      var resultJson = JSON.stringify(resultObject);

      callback(null, data.Body);

    }
  });

};
