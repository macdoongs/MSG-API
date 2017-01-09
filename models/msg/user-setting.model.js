
var db_sql = require('./sql_action');

exports.register_user_setting = function(userId, messageAlert, reserveEnable, reserveAlert, weekNumber, reserveNumber, callback){
  //console.log("register_user_setting");

  db_sql.select_user_setting(userId, function(error, results_check){
    if(error){
      callback(true, results_check);
    }else{
      console.log(results_check[0]);
      if(results_check[0] == undefined){
        db_sql.insert_user_setting(userId, messageAlert, reserveEnable, reserveAlert, weekNumber, reserveNumber, function(error, results_insert){
          if(error){
            //console.log(error);
            callback(true, results_insert);
          }else{
            callback(null, results_insert);
          }
        });
      }else{
        db_sql.update_user_setting(userId, messageAlert, reserveEnable, reserveAlert, weekNumber, reserveNumber, function(error, results_insert){
          if(error){
            //console.log(error);
            callback(true, results_insert);
          }else{
            callback(null, results_insert);
          }
        });
      }
    }
  });
/*

*/
};

exports.load_user_setting = function(userId, callback){
  //console.log('load_user_setting');
  db_sql.select_user_setting(userId, function(error, results_error){
    if(error){
      //console.log(error);
      callback(true, results_error);
    }else{
      callback(null, results_error);
    }
  });
};
