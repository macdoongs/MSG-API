
var db_sql = require('./sql_action');

exports.register_kakao_user_key = function(userKey, callback){
  register_kakao_user_id_by_key(userKey, function(error, result_insert){
    if(error){
      callback(true, result_insert);
    }else{
      callback(null, result_insert);
    }
  });
};

function register_kakao_user_id_by_key (userKey, callback){
  db_sql.insert_kakao_user_key(userKey, function(error, result_insert){
    if(error){
      callback(true, result_insert);
    }else{
      callback(null, result_insert);
    }
  });
};

exports.load_kakao_user_id = function(userKey, callback){
  load_kakao_user_id_by_key(userKey, function(error, result_load){

  });
}

function load_kakao_user_id_by_key (userKey, callback){
  db_sql.select_kakao_user_key(userKey, function(error, result_select){
    if(error){
      callback(true, result_select);
    }else{
      callback(null, result_select);
    }
  });
}

exports.register_yellow_id_message = function(userKey, type, content, callback){
  load_kakao_user_id_by_key(userKey, function(error, result_load){
    if(error){
      callback(true, result_load);
    }else{
      if(result_load.length > 0){
        var kakaoUserId = result_load[0].kakao_user_id;

        db_sql.insert_yellow_id_message(type, content, function(error, result_insert){
          var yellowIdMessageId = result_insert.insertId;

          db_sql.insert_yellow_id_request(kakaoUserId, yellowIdMessageId, function(error, result){
            callback(null, result);
          });
        });

      }else{
        register_kakao_user_id_by_key(userKey, function(error, result_register){
          if(error){
            callback(true, result_register);
          }else{
            var kakaoUserId = result_register.insertId;
            console.log("kakaoUserId : " + kakaoUserId);

            db_sql.insert_yellow_id_message(type, content, function(error, result_insert){
              var yellowIdMessageId = result_insert.insertId;
              console.log("yellowIdMessageId : " + yellowIdMessageId);

              db_sql.insert_yellow_id_request(kakaoUserId, yellowIdMessageId, function(error, result){
                callback(null, result);
              });
            });
          }
        });
      }
    }
  });
};
