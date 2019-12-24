'use strict';

module.exports = function(customUser) {
customUser.searchRingCentralUser = function(name, callback) {
	customUser.find({
	  limit: 30,
	  where:{and:[{searchName:{like: '%'+ name +'%'}},{type:"ringCentral"}]}}).then(async function(users){
	  	callback(null,users);
	  });
};
};
