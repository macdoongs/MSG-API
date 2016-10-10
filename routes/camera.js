var express = require('express');
var router = express.Router();

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/s3_config.json');
var s3Bucket = new AWS.S3( { params: {Bucket: 'korchid'} } );

var aeid = '';

/* GET home page. */
router.get(['/', '/:id'], function(req, res, next) {


	var data = {
    Key: 'Path',
		ACL:'public-read',
    Body: 'Image',
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg'
  };

	aeid = "Sajouiot02";

	url = 'http://localhost:7579/mobius-yt/'+ aeid + '/camera?rcn=4&lim=1';
	request({
     		url : url,
     		method: 'GET',
     		headers : {
      			'Accept':'application/xml',
      			'X-M2M-RI': '12345',
      			'X-M2M-Origin': 'SOrigin',
						'nmtype':'short'    },
		//qs: {'query' : text}
   	}, function(error, response, body) {
    		if(error) {
      			console.log(error);
    		}else{

					parser.parseString(body, function(err, result) {
  					//console.log(result);
						sResult = JSON.stringify(result);
						oResult = JSON.parse(sResult);

						var cin = oResult['m2m:rsp']['m2m:cin'];
						var image = cin[0]['con'][0];



						data.Key = "korchid.com/image/" + aeid + "/capture.png";
						data.Body = image;


						s3Bucket.putObject(data, function(err, data){
					      if (err) {
					        console.log(err);
					        console.log('Error uploading data: ', data);
					      } else {
					        console.log('succesfully uploaded the image!');
					      }
					  });

						res.render('camera', {title:"Place of Chatting", image:image});
					});

			}
		});
});

module.exports = router;
