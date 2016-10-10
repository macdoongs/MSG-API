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
router.get(['/', '/:userid/:roomid'], function(req, res, next) {
	var userid = req.params.userid;
	var roomid = req.params.roomid;
	aeid = roomid;


	var data = {
    Key: 'Path',
		ACL:'public-read',
    Body: 'Image',
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg'
  };

	url = 'http://'+ mobiushost + ':' + usecsebaseport + '/' + usecsebase + '/'+ aeid + '/camera?rcn=4&lim=1';
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
						try{
							var cin = oResult['m2m:rsp']['m2m:cin'];
							var image = cin[0]['con'][0];
						}catch(exception){
							console.log(exception);
							res.send('No data!');
						}


						var timeSaved = Date.now();
						data.Key = "korchid.com/image/" + aeid + "/" + timeSaved;
						data.Body = image;


						s3Bucket.putObject(data, function(err, data){
					      if (err) {
					        console.log(err);
					        console.log('Error uploading data: ', data);
					      } else {
					        console.log('succesfully uploaded the image!');
					      }
					  });

						var pathSaved = "https://s3.ap-northeast-2.amazonaws.com/korchid/korchid.com/image/" + aeid + "/" + timeSaved;

						res.render('camera', {title:"Place of Chatting", userid:userid, roomid:roomid, image:image, path:pathSaved});
					});

			}
		});
});

module.exports = router;
