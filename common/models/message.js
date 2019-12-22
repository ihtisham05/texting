'use strict';

module.exports = function(message) {
message.updateReadStatus = function(id,userId,chatUserId,serviceId, callback) {
  message.updateAll({and:[{id:{lte:id}},{for:userId},{from:chatUserId},{serviceId:serviceId}]},{read:1}).then(async function(res){
  	callback(null, {"statusCode":200,message:"successfully updated read status"});
  });
};
message.getChatList = function(userId, callback) {
        const USER = message.app.models.customuser;
	// var sql = "SELECT * FROM messages  WHERE ID_to = 1140816689329214 OR ID_from = 1140816689329214  GROUP BY id_to ORDER BY MAX(timestamp_msg) DESC;"

	// var sql = "SELECT * FROM message  GROUP BY message.from ORDER BY MAX(message.createdAt) DESC";
	// var sql = "SELECT distinct(r.from),createdAt FROM (SELECT * FROM  `message` t WHERE (t.from =1 OR t.for =1) ORDER BY t.createdAt DESC)r"
 //    // var sql = "SELECT r , (r.from + r.for) AS dist FROM (SELECT * FROM  `message` t WHERE (t.from =1 OR t.for =1) ORDER BY t.createdAt DESC)r ORDER BY dist.createdAt";
 //    var ds = message.app.datasources.db;
 //    ds.connector.execute(sql, [], async function (err, users) {
 //      if (err) {
 //        return callback(err, null);
 //      } else {
 //      	console.log("users",users);
 //      }
 //  	});
 	message.find({order:'createdAt DESC',where:{or:[{for:userId},{from:userId}]}}).then(async function(allMessages){
        var allIds = [];
        for(let user of allMessages){
          let obj = {};
          if(user.from == userId){
            obj.id = user.for;
            obj.createdAt = user.createdAt;
            obj.message = user.message;
            allIds.push(obj);
          }else{
            obj.id = user.from;
            obj.createdAt = user.createdAt;
            obj.message = user.message;
            allIds.push(obj);
          }
        }
        var flags = {};
        var uniqueMessages = await allIds.filter(function (entry) {
          if (flags[entry.id]) {
            return false;
          }
          flags[entry.id] = true;
          return true;
        });
        var onlyIds = [];
        for(let single of uniqueMessages){
          if(single.id!= userId){
            await onlyIds.push(single.id);
          }
        }
        var userResult = await USER.find({where:{id:{inq:onlyIds}}});
        var finalArray = [];
        for(let singleUser of uniqueMessages){
          for(let singleUser2 of userResult){
            let singleuser2 = singleUser2.toJSON();
            if(singleUser.id == singleUser2.id){
              singleUser2.createdAt = singleUser.createdAt;
              singleUser2.message = singleUser.message;

              await finalArray.push(singleUser2);
              break;
            }
          }
        }
      return callback(null, finalArray);
  })
};
};
