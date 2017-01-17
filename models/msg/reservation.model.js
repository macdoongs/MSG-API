
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

// doesn't work this function...
exports.load_reservation_message = function(callback){
  db_sql.select_reservation_message(function(error, results_load_reservation_message){
    if(error){
      callback(true, results_load_reservation_message);
    }else{
      callback(null, results_load_reservation_message);
    }
  });
};

exports.load_type_reservation_message = function(reservationMessageType, callback){
  db_sql.select_type_reservation_message(reservationMessageType, function(error, results_load_reservation_message){
    if(error){
      callback(true, results_load_reservation_message);
    }else{
      callback(null, results_load_reservation_message);
    }
  });
};
