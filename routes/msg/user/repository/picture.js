var express = require('express');
var router = express.Router();

var config = require('config.json')('./config/config.json');

var multiparty = require('multiparty');
var fs = require('fs');

var multer = require('multer');
var multerS3 = require('multer-s3');

var upload = multer({ dest: 'uploads/' })

var Q = require('q');

var formidable = require('formidable');
var util = require('util');

var AWS = require('aws-sdk');

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


/*
[Multer 초기화]
웹 서버에서 파일 업로드 버퍼를 처리하되 물리적으로 파일을 저장하지 않기 위해 메모리 스토리지 타입의 객체를 생성합니다.
웹 서버에 물리적으로 저장하는 것보다 아마존 S3 등을 이용하는 것이 좋은 이유는,
로드 밸런서 등을 활용하여 여러 웹 서버가 같은 Node.js 웹 서비스를 제공할 때 특정 서버만 파일을 보유하게 되는 현상 등이 생기는 것을 미연에 방지할 수 있기 때문입니다.
필요할 경우 메모리 스토리지 대신 다른 스토리지를 써도 됩니다.
*/
//var memorystorage = multer.memoryStorage()
//var upload = multer({ storage: memorystorage })


router.post(['/'], multer({ dest: 'uploads/'}).single('myfile'),  function(req, res, next){
			//console.log(req.body); //form fields
      console.log(req.file); //form files
			//res.send(req.file);
      res.status(204).end();
/*
	upload(req, res).then(function (file) {
    res.json(file);
  }, function (err) {
    res.send(500, err);
  });
	*/
/*
	var form = new formidable.IncomingForm();


	console.log(form.multiples);
  form.multiples = true;


    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));
    });

		// data 전송중..
    form.on('progress', function(bytesReceived, bytesExpected) {
        var percent_complete = (bytesReceived / bytesExpected) * 100;
        console.log("============ progress ===================");
        console.log("bytesReceiveed ==> ", bytesReceived, " ; bytesExpected ==> ", bytesExpected);
        console.log(percent_complete.toFixed(2), "% uploaded...");
    });

    form.on('error', function(err) {
        console.log("=========== error ============");
        console.error(err);
    });

		form.on('end', function(fields, files) {
      // console.log(this.openedFiles);
      console.log(" 총 업로드 파일 갯수 == ", this.openedFiles.length);

      for(var i = 0; i < this.openedFiles.length; i++) {
          // Temporary location of our uploaded file
          // 맥에서는 temp_path 가 폴더가 아니라, 업로드한 파일임.
          var temp_path = this.openedFiles[i].path;
          // The file name of the uploaded file
          var file_name = this.openedFiles[i].name;

          // Location where we want to copy the uploaded file
          var new_location = './files/';

          console.log("temp_path == ", temp_path);
          console.log("file_name == ", file_name);
          console.log(this.openedFiles[i]);

					repository_model.uploadProfile(null, file_name, temp_path, function(error, result_save){

					});

          // temp_path 로 받은 파일을, 원래 이름으로 변경하여 이동시킨다.
          fs.move(temp_path, new_location + file_name, function (err) {
              if (err) {
                  console.error(err);
              } else {
                  console.log("success!")
              }
          });
      }
  });
*/

/*
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

       console.log("Write Streaming file :"+filename);
       var writeStream = fs.createWriteStream('/tmp/'+filename);
       writeStream.filename = filename;
       part.pipe(writeStream);

       part.on('data',function(chunk){
             console.log(filename+' read '+chunk.length + 'bytes');
       });

       part.on('end',function(){
             console.log(filename+' Part read complete');
             writeStream.end();
       });
  });

  // all uploads are completed
  form.on('close',function(){
       res.status(200).send('Upload complete');
  });

  // track progress
  form.on('progress',function(byteRead,byteExpected){
       console.log(' Reading total  '+byteRead+'/'+byteExpected);
  });

  form.parse(req);
*/

  //res.send("OK");

});


var upload = function (req, res) {
  var deferred = Q.defer();
  var storage = multer.diskStorage({
    // 서버에 저장할 폴더
    destination: function (req, file, cb) {
      cb(null, imagePath);
    },

    // 서버에 저장할 파일 명
    filename: function (req, file, cb) {
      file.uploadedFile = {
        name: req.params.filename,
        ext: file.mimetype.split('/')[1]
      };
      cb(null, file.uploadedFile.name + '.' + file.uploadedFile.ext);
    }
  });

  var upload = multer({ storage: storage }).single('file');
  upload(req, res, function (err) {
    //if (err) deferred.reject();
    //else deferred.resolve(req.file.uploadedFile);
  });
  return deferred.promise;
};


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
