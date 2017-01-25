
var db_sql = require('./sql_action');

var AWS = require('aws-sdk');
AWS.config.loadFromPath(' ../../config/s3_config.json');
var s3Bucket = new AWS.S3( { params: {Bucket: 'korchid'} } );


exports.uploadProfile = function(loginToken, fileName, image, callback){
  console.log("uploadProfile");

  var resultObject = new Object();

  var params = {
    Key: 'Path',
		ACL:'public-read',
    Body: 'Image',
    ContentEncoding: 'jpg',
    ContentType: 'image/jpeg'
  };

  params.Key = "com.korchid.msg/image/profile/" + fileName + ".png";

  s3Bucket.putObject(params, function(err, data){
      if (err) {
        resultObject.upload = false;
        resultObject.key = null;
        resultObject.body = null;

        var resultJson = JSON.stringify(resultObject);

        callback(true, resultJson);

        console.log('Error uploading data: ', data);
      } else {
        resultObject.upload = true;
        resultObject.key = params.Key;
        resultObject.body = params.Body;

        var resultJson = JSON.stringify(resultObject);

        callback(null, resultJson);

        console.log('succesfully uploaded the image!');
      }
  });

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

      callback(null, resultJson);

    }
  });

};
