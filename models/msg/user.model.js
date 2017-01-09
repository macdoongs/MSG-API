
var db_sql = require('./sql_action');


exports.load_user = function(userId, callback){
  //console.log('load_user_setting');
  db_sql.select_user_all(userId, function(error, results_error){
    if(error){
      //console.log(error);
      callback(true, results_error);
    }else{
      callback(null, results_error);
    }
  });
};
