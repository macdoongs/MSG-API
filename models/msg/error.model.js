
var db_sql = require('./sql_action');

exports.submit_error = function(userId, log, callback){
  //console.log("submit_error");
  if(userId == undefined){
    db_sql.insert_error(log, function(error, results_error){
      if(error){
        //console.log(error);
        callback(true, results_error);
      }else{
        callback(null, results_error);
      }
    });
  }else{
    db_sql.insert_user_error(userId, log, function(error, results_error){
      if(error){
        //console.log(error);
        callback(true, results_error);
      }else{
        callback(null, results_error);
      }
    });
  }
};

exports.load_error = function(userId, callback){
  console.log('load_error');

  if(userId == undefined){
    db_sql.select_error(function(error, results_error){
      if(error){
        //console.log(error);
        callback(true, results_error);
      }else{
        callback(null, results_error);
      }
    });
  }else{
    db_sql.select_user_error(userId, function(error, results_error){
      if(error){
        //console.log(error);
        callback(true, results_error);
      }else{
        callback(null, results_error);
      }
    });
  }

};
