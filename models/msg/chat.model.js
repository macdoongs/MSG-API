
var db_sql = require('./sql_action');

exports.chat = function(senderId, receiverId, message, callback){
  //console.log("chat");
  //console.log("phoneNumber : " + phoneNumber + ", password : " + password);
  db_sql.insert_message(message, function(error, results_message){
    if(error){
      //console.log("error : " + error);
      callback(true, results_message);
    }else{
      console.log(results_message);

/*
      db_sql.insert_send_message(messageId, senderId, receiverId, function(error, results_send){
        if(error){
          callback(true, results_send);
        }else{
          callback(null, results_send);
        }
      });*/
    }

  });
};
