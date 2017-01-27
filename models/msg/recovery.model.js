
var bcrypt = require('bcryptjs');

var randomstring = require('randomstring');

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
          var tempPassword = randomstring.generate({
            length : 7,
            charset : 'alphabetic'
          });

          user_model.change_password(trimmedPhoneNumber, tempPassword, function(error, result_change){

            resultObject.recovery = true;
            resultObject.password = tempPassword;


            var resultJson = JSON.stringify(resultObject);

            callback(null, resultJson);
          });

        }else{
          resultObject.recovery = false;
          resultObject.password = "";

          var resultJson = JSON.stringify(resultObject);

          callback(null, resultJson);

        }

      }
    });
  });
};
