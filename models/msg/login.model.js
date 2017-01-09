
var db_sql = require('./sql_action');

exports.app_login = function(phoneNumber, password, callback){
  //console.log("app_login");
  //console.log("phoneNumber : " + phoneNumber + ", password : " + password);
  db_sql.select_user_phone_number(phoneNumber, function(error, results_login){
    if(error){
      //console.log("error : " + error);
      callback(true, results_login);
    }else{
      //console.log(results_login);
      if(results_login[0].password_sn == password){
        callback(null, results_login);
      }
    }
  });
};
