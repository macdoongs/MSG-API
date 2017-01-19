
var db_sql = require('./sql_action');

var user_model = require('./user.model');

exports.find_password = function(phoneNumber, callback){
  console.log('find_password');

  user_model.trimUserInputData(phoneNumber, function(trimmedPhoneNumber){
    db_sql.select_user_password(trimmedPhoneNumber, function(error, results_password){
      var resultObject = new Object();
      if(error){
        //console.log(error);
        callback(true, results_password);
      }else{
        if(results_password.length > 0){
          resultObject.recovery = true;
          resultObject.password = results_password[0].password_ln;
        }else{
          resultObject.recovery = false;
          resultObject.password = "";
        }

        var resultJson = JSON.stringify(resultObject);

        callback(null, resultJson);
      }
    });
  });
};
