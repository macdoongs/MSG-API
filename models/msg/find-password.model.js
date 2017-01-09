
var db_sql = require('./sql_action');

exports.find_password = function(phoneNumber, callback){
  console.log('find_password');

  db_sql.select_user_password(phoneNumber, function(error, results_password){
    if(error){
      //console.log(error);
      callback(true, results_password);
    }else{
      callback(null, results_password);
    }
  });

};
