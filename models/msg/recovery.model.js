
var db_sql = require('./sql_action');


exports.find_password = function(phoneNumber, callback){
  console.log('find_password');

  db_sql.select_user_password(phoneNumber, function(error, results_password){
    var resultObject = new Object();
    if(error){
      //console.log(error);
      callback(true, results_password);
    }else{
      if(results_password.length > 0){
        resultObject.recovery = true;
        resultObject.password = results_password[0].password_sn;
      }else{
        resultObject.recovery = false;
        resultObject.password = "";
      }

      var resultJson = JSON.stringify(resultObject);

      callback(null, resultJson);
    }
  });

};
