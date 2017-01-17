var util = require('util');
var moment = require('moment');

var db = require('./db_action');

var _this = this;

const max_lim = 1000;

/*
 * error table query
 */

 exports.insert_error = function(log, callback) {
     console.time('insert_error');
     var sql = util.format('INSERT INTO error (' +
         'user_id, log_txt) ' +
         'VALUE (null, \'%s\')',
         log);
     db.getResult(sql, '', function (err, results) {
         console.timeEnd('insert_error');
         callback(err, results);
     });
 };

exports.select_error = function(callback) {
   var sql = util.format("SELECT * FROM error");
   db.getResult(sql, '', function (err, results_error) {
     callback(err, results_error);
   });
};

exports.insert_user_error = function(userId, log, callback) {
    console.time('insert_error');
    var sql = util.format('INSERT INTO error (' +
        'user_id, log_txt) ' +
        'VALUE (\'%s\', \'%s\')',
        userId, log);
    db.getResult(sql, '', function (err, results) {
        console.timeEnd('insert_error');
        callback(err, results);
    });
};

exports.select_user_error = function(userId, callback) {
   var sql = util.format("SELECT * FROM error WHERE (" +
     "user_id = %d)",
      userId);
   db.getResult(sql, '', function (err, select_user_error) {
       callback(err, select_user_error);
   });
};


/*
 * user table query
 */
exports.insert_user = function(phoneNumber, password, callback) {
   console.time('insert_user');
   var sql = util.format('INSERT INTO user (' +
       'phone_number_sn, password_sn) ' +
       'VALUE (\'%s\', \'%s\')',
       phoneNumber, password);
   db.getResult(sql, '', function (err, results) {
       console.timeEnd('insert_user');
       callback(err, results);
   });
};


exports.select_user_phone_number = function(phoneNumber, callback){
  var sql = util.format('SELECT * FROM user WHERE (' +
      'phone_number_sn)' +
      '= (\'%s\')',
      phoneNumber);
  db.getResult(sql, '', function (err, results_phone) {
    callback(err, results_phone);
  });
};

exports.select_user_password = function(phoneNumber, callback){
  var sql = util.format('SELECT password_sn FROM user WHERE (' +
      'phone_number_sn' +
      '= \'%s\')',
      phoneNumber);
  db.getResult(sql, '', function (err, results_password) {
    callback(err, results_password);
  });
};


exports.update_user_device_token = function(userId, deviceToken, callback){
  var sql = util.format('UPDATE user SET device_token_ln = \'%s\' ' +
      'WHERE user_id = %s',
      deviceToken, userId);
  db.getResult(sql, '', function (err, results_password) {
    callback(err, results_password);
  });
};

/*
 * user_setting table query
 */
 exports.insert_user_setting_id = function(userId, callback){
   console.time('insert_user_setting_id');
   var sql = util.format('INSERT INTO user_setting (' +
     'user_id ) ' +
     'VALUE (%s)',
     userId);
   db.getResult(sql, '', function (err, results) {
       console.timeEnd('insert_user_setting_id');
       callback(err, results);
   });
 };

 exports.insert_user_setting = function(userId, messageAlert, reserveEnable, reserveAlert, weekNumber, reserveNumber, callback) {
   console.time('insert_user_setting');
   var sql = util.format('INSERT INTO user_setting (' +
       'user_id, message_alert, reserve_enable, reserve_alert, week_number, reserve_number) ' +
       'VALUE (\'%s\', \'%s\', \'%s\', \'%s\', \'%s\', \'%s\')',
       userId, messageAlert, reserveEnable, reserveAlert, weekNumber, reserveNumber);
   db.getResult(sql, '', function (err, results) {
       console.timeEnd('insert_user_setting');
       callback(err, results);
   });
 };

 exports.select_user_setting = function(userId, callback){
   var sql = util.format('SELECT * FROM user_setting WHERE ( ' +
    'user_id = \'%s\')',
    userId);
    db.getResult(sql, '', function (err, results) {
        callback(err, results);
    });
 };

 exports.update_user_setting = function (userId, messageAlert, reserveEnable, reserveAlert, weekNumber, reserveNumber, callback) {
   console.time('update_user_setting');
   var sql = util.format("UPDATE user_setting SET " +
    "message_alert = %s, reserve_enable = %s, reserve_alert = %s, week_number = \'%s\', reserve_number = \'%s\', update_dtm = now() " +
    "WHERE user_id = \'%s\'",
    messageAlert, reserveEnable, reserveAlert, weekNumber, reserveNumber,
    userId);
   db.getResult(sql, '', function (err, results) {
      console.time('update_user_setting');
      callback(err, results);
   });
 };

 exports.delete_user_setting = function (userId, callback) {
     var sql = util.format("DELETE FROM user_setting WHERE user_id = \'%s\'", userId);
     db.getResult(sql, '', function (err, delete_Obj) {
         if(!err) {
             callback(err, delete_Obj);
         }
     });
 };


/*
 * user_information table query
 */
exports.insert_user_information_id = function(userId, callback){
  console.time('insert_user_information_id');
  var sql = util.format('INSERT INTO user_information (' +
    'user_id ) ' +
    'VALUE (%s)',
    userId);
  db.getResult(sql, '', function (err, results) {
      console.timeEnd('insert_user_information_id');
      callback(err, results);
  });
};

exports.insert_user_information = function(userId, nickname, sex, birthday, profile, callback) {
  console.time('insert_user_information');
  var sql = util.format('INSERT INTO user_information (' +
      'user_id, nickname_sn, sex_sn, birthday_dt, profile_ln) ' +
      'VALUE (%s, \'%s\', \'%s\', \'%s\', \'%s\')',
      userId, nickname, sex, birthday, profile);
  db.getResult(sql, '', function (err, results) {
      console.timeEnd('insert_user_information');
      callback(err, results);
  });
};

exports.select_user_information = function(userId, callback){
  var sql = util.format('SELECT * FROM user_information WHERE ( ' +
   'user_id = %s)',
   userId);
   db.getResult(sql, '', function (err, results) {
       callback(err, results);
   });
};

exports.update_user_information = function(userId, nickname, sex, birthday, profile, callback) {
  console.time('update_user_information');
  var sql = util.format("UPDATE user_information SET " +
   "nickname_sn = \'%s\', sex_sn = \'%s\', birthday_dt = \'%s\', profile_ln = \'%s\', update_dtm = now() " +
   "WHERE user_id = %s",
   nickname, sex, birthday, profile,
   userId);
  db.getResult(sql, '', function (err, results) {
     console.time('update_user_information');
     callback(err, results);
  });
};

exports.delete_user_information = function (userId, callback) {
    var sql = util.format("DELETE FROM user_information WHERE user_id = \'%s\'", userId);
    db.getResult(sql, '', function (err, delete_Obj) {
        if(!err) {
            callback(err, delete_Obj);
        }
    });
};

/*
 * message, send_message table query
 */

 exports.insert_message = function(message, callback) {
   console.time('insert_message');
   var sql = util.format('INSERT INTO message (' +
       'content_txt) ' +
       'VALUE (\'%s\')',
       message);
   db.getResult(sql, '', function (err, results) {
       console.timeEnd('insert_message');
       callback(err, results);
   });
 };

 exports.insert_send_message = function(messageId, senderId, receiverId, callback) {
   console.time('insert_send_message');
   var sql = util.format('INSERT INTO send_message (' +
       'message_id, sender_id, receiver_id) ' +
       'VALUE (\'%s\', \'%s\', \'%s\')',
       messageId, senderId, receiverId);
   db.getResult(sql, '', function (err, results) {
       console.timeEnd('insert_send_message');
       callback(err, results);
   });
 };

exports.select_user_send_message = function(senderId, receiverId, callback){
  var sql = util.format('SELECT send_dtm, content_txt, unread_check FROM send_message INNER JOIN message ' +
   'ON send_message.message_id = message.message_id ' +
   'WHERE sender_id = \'%s\' AND receiver_id = \'%s\'',
   senderId, receiverId);
   db.getResult(sql, '', function (err, results) {
       callback(err, results);
   });
};


exports.select_user_all_data = function(userId, callback){
  var sql = util.format("select u_2.user_id, nickname_sn, sex_sn, birthday_dt, profile_ln, role_name_sn, message_alert, reserve_enable, reserve_alert, week_number, reserve_number from user_setting as us join (select ui.user_id, nickname_sn, sex_sn, birthday_dt, profile_ln, role_name_sn from user_information as ui join (select user_id, role_name_sn from choose_role as cu join user_role as ur on cu.user_role_id = ur.user_role_id where user_id = %s) as u_1 on ui.user_id = u_1.user_id) as u_2 on us.user_id = u_2.user_id",
   userId);
   db.getResult(sql, '', function (err, results) {
       callback(err, results);
   });
};

/*
 * user_role, choose_role table query
 */

exports.select_role_id = function(roleName, callback){
  var sql = util.format("SELECT * FROM user_role " +
    "WHERE role_name_sn = \'%s\'",
    roleName);
    db.getResult(sql, '', function (err, results) {
        callback(err, results);
    });
};

/*
 * user_role, choose_role table query
 */

exports.select_user_choose_role = function(userId, roleId, callback){
  var sql = util.format("SELECT * FROM choose_role " +
    "WHERE user_id = %s AND user_role_id = %s",
    userId, roleId);
    db.getResult(sql, '', function (err, results) {
        callback(err, results);
    });
};

exports.insert_user_choose_role = function(userId, roleId, callback){
  var sql = util.format("INSERT INTO choose_role (user_id, user_role_id) " +
    "VALUE (%s, %s)",
   userId, roleId);
   db.getResult(sql, '', function (err, results) {
       callback(err, results);
   });
};

exports.select_user_choose_role_id = function(userId, receiverPhoneNumber, callback){
  var sql = util.format("select choose_role.choose_role_id from choose_role join invite_user " +
  "where user_id = %s and receiver_phone_number_sn = \'%s\'"+
  "group by choose_role.choose_role_id",
   userId, receiverPhoneNumber);
   db.getResult(sql, '', function (err, results) {
       callback(err, results);
   });
};

/*
 * invite_user table query
 */

exports.insert_user_invite_user = function(chooseRoleId, receiverPhoneNumber, callback){
  var sql = util.format("INSERT INTO invite_user (choose_role_id, receiver_phone_number_sn)" +
    "VALUE (%s, \'%s\')",
    chooseRoleId, receiverPhoneNumber);
    db.getResult(sql, '', function (err, results) {
        callback(err, results);
    });
};


exports.select_user_invite_user = function(chooseRoleId, receiverPhoneNumber, callback){
  var sql = util.format("SELECT * FROM invite_user WHERE " +
    "choose_role_id = %s AND receiver_phone_number_sn = \'%s\'",
    chooseRoleId, receiverPhoneNumber);
    db.getResult(sql, '', function (err, results) {
        callback(err, results);
    });
};


exports.select_connection_invite_user = function(senderId, receiverPhoneNumber, callback){
  var sql = util.format("select * from invite_user where choose_role_id " +
    "in (select choose_role_id from choose_role where user_id " +
    "in (select user_id from user where phone_number_sn = \'%s\')) " +
    "and receiver_phone_number_sn in (select phone_number_sn from user where user_id = %s)"
    , receiverPhoneNumber, senderId);
    db.getResult(sql, '', function (err, results) {
        callback(err, results);
    });

};


exports.update_connection_invite_user_id = function(inviteUserId, callback){
  console.time('update_connection_invite_user_id');
  var sql = util.format("update invite_user set connection = 1 where invite_user_id = %s",
    inviteUserId);
    db.getResult(sql, '', function (err, results) {
        console.timeEnd('update_connection_invite_user_id');
        callback(err, results);
    });
};

/*
 * map_user table query
 */

exports.insert_user_map_user = function(parentId, childId, topic, callback){
  console.time('insert_user_map_user');
  var sql = util.format("INSERT INTO map_user (parent_id, child_id, topic_mn)" +
   "VALUE (%s, %s, \'%s\')",
   parentId, childId, topic);
   db.getResult(sql, '', function (err, results) {
     console.timeEnd('insert_user_map_user');
       callback(err, results);
   });
};


exports.select_parent_map_user = function (userId, callback) {
  var sql = util.format("select nickname_sn, phone_number_sn, profile_ln, child_id as user_id, topic_mn from user_information " +
    " join (select phone_number_sn, child_id, topic_mn from user join map_user on user.user_id = map_user.child_id where parent_id = %s) as u_1 " +
    "on u_1.child_id = user_information.user_id",
    userId);
    db.getResult(sql, '', function (err, results) {
        callback(err, results);
    });
};

exports.select_child_map_user = function (userId, callback) {
  var sql = util.format("select nickname_sn, phone_number_sn, profile_ln, parent_id as user_id, topic_mn from user_information "+
    " join (select phone_number_sn, parent_id, topic_mn from user join map_user on user.user_id = map_user.parent_id where child_id = %s) as u_1 " +
    "on u_1.parent_id = user_information.user_id",
    userId);
    db.getResult(sql, '', function (err, results) {
        callback(err, results);
    });
}


/*
 * reserve_message table query
 */

 exports.insert_user_reserve_message = function(senderId, receiverId, reservationMessageId, reserveDTM, callback){
  var sql = util.format("INSERT INTO reserve_message (sender_id, receiver_id, reservation_message_id, reserve_dtm)" +
    "VALUE (%s, %s, %s, \'%s\')",
    senderId, receiverId, reservationMessageId, reserveDTM);
    db.getResult(sql, '', function (err, results) {
        callback(err, results);
    });
 };

/*
 * reservation_message table query
 */

exports.insert_reservation_message = function(reservationMessageType, content, callback){
  var sql = util.format("INSERT INTO reservation_message (reservation_message_type, content_txt)" +
    "VALUE (%s, \'%s\')",
    reservationMessageType, content);
    db.getResult(sql, '', function (err, results) {
        callback(err, results);
    });
};

exports.select_reservation_message = function (callback) {
  var sql = util.format("SELECT * FROM reservation_message");
  db.getResult(sql, '', function (err, results) {
      callback(err, results);
  });
}


exports.select_type_reservation_message = function(reservation_message_type_id, callback){
  var sql = util.format("SELECT * FROM reservation_message WHERE reservation_message_type_id = %s",
  reservation_message_type_id);
  db.getResult(sql, '', function (err, results) {
      callback(err, results);
  });
};


/*
 * reservation_message_type table query
 */

exports.insert_reservation_message_type = function(typeName, callback){
 var sql = util.format("INSERT INTO reservation_message_type (reservation_message_type)" +
   "VALUE (\'%s\')",
   typeName);
   db.getResult(sql, '', function (err, results) {
       callback(err, results);
   });
};
