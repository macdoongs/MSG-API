
var db_sql = require('./sql_action');

exports.register = function(userId, deviceToken, callback){
  //console.log("chat");
  //console.log("phoneNumber : " + phoneNumber + ", password : " + password);

  db_sql.update_user_device_token(userId, deviceToken, function(error, results_register){
    if(error){
      //console.log("error : " + error);
      callback(true, results_register);
    }else{
      console.log(results_message);
      callback(null, results_register)
    }

  });
};
