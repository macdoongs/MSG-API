
var db_sql = require('./sql_action');


exports.reserve_message = function(senderId, receiverId, reservationMessageId, reserveDTM, callback){
  db_sql.insert_user_reserve_message(senderId, receiverId, reservationMessageId, reserveDTM, function(error, results_reserve){
    if(error){
      callback(true, results_reserve);
    }else{
      callback(null, results_reserve);
    }
  });
};
