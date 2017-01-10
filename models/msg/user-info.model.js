
var db_sql = require('./sql_action');

exports.register_user_information = function(userId, nickname, sex, birthday, profile, callback){
  //console.log("register_user_setting");

  db_sql.select_user_information(userId, function(error, results_check){
    if(error){
      callback(true, results_check);
    }else{
      //console.log(results_check[0]);
      if(results_check[0] == undefined){
        db_sql.insert_user_information(userId, nickname, sex, birthday, profile, function(error, results_insert){
          if(error){
            //console.log(error);
            callback(true, results_insert);
          }else{
            callback(null, results_insert);
          }
        });
      }else{
        db_sql.update_user_information(userId, nickname, sex, birthday, profile, function(error, results_update){
          if(error){
            //console.log(error);
            callback(true, results_update);
          }else{
            callback(null, results_update);
          }
        });
      }
    }
  });
};

exports.load_user_information = function(userId, callback){
  //console.log('load_user_setting');
  db_sql.select_user_information(userId, function(error, results_error){
    if(error){
      //console.log(error);
      callback(true, results_error);
    }else{
      callback(null, results_error);
    }
  });
};
