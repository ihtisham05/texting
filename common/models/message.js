'use strict';

module.exports = function(message) {
message.updateReadStatus = function(id,userId,chatUserId,serviceId, callback) {
  message.updateAll({and:[{id:{lte:id}},{for:userId},{from:chatUserId},{serviceId:serviceId}]},{read:1}).then(async function(res){
  	callback(null, {"statusCode":200,message:"successfully updated read status"});
  });
};
};
