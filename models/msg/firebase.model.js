
var db_sql = require('./sql_action');

exports.register = function(userId, deviceToken, callback){
  //console.log("chat");
  //console.log("phoneNumber : " + phoneNumber + ", password : " + password);

  db_sql.update_user_device_token(userId, deviceToken, function(error, results_register){
    var resultObject = new Object();

    if(error){
      resultObject.register = false;
      //console.log("error : " + error);

      var resultJson = JSON.stringify(resultObject);

      callback(true, results_register);
    }else{
      console.log(results_register);


  		if(error){
  			resultObject.register = false;
  		}else{
  			resultObject.register = true;
  		}

  		var resultJson = JSON.stringify(resultObject);

      callback(null, results_register)
    }

  });
};
