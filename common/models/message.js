'use strict';

module.exports = function(message) {
message.updateReadStatus = function(id,userId,chatUserId,serviceId, callback) {
  message.updateAll({and:[{id:{lte:id}},{for:userId},{from:chatUserId},{serviceId:serviceId}]},{read:1}).then(async function(res){
  	callback(null, {"statusCode":200,message:"successfully updated read status"});
  });
};
message.getChatList = function(userId, callback) {
  const USER = message.app.models.customuser;
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
message.getMessage = function(userId1,userId2,startIndex, limit, callback) {
  message.find({skip: startIndex, limit: limit, order: 'createdAt DESC',where:{and:[{or:[{for:userId1},{for:userId2}]},{or:[{from:userId1},{from:userId2}]}]}}).then(async function(messages){
    callback(null,messages);
  });
};
};
