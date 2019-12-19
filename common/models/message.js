'use strict';

module.exports = function(message) {
message.updateReadStatus = function(id,userId,chatUserId,serviceId, callback) {
  message.updateAll({and:[{id:{lte:id}},{for:userId},{from:chatUserId},{serviceId:serviceId}]},{read:1}).then(async function(res){
  	callback(null, {"statusCode":200,message:"successfully updated read status"});
  });
};
message.getChatList = function(userId, callback) {
	// var sql = "SELECT * FROM messages  WHERE ID_to = 1140816689329214 OR ID_from = 1140816689329214  GROUP BY id_to ORDER BY MAX(timestamp_msg) DESC;"

	var sql = "SELECT * FROM message  inner join customuser where message.from = customuser.id ORDER BY MAX(message.createdAt) DESC";
    var ds = message.app.datasources.db;
    ds.connector.execute(sql, [], async function (err, users) {
      if (err) {
        return callback(err, null);
      } else {
      	console.log("users",users);
      }
  	});
};
};
