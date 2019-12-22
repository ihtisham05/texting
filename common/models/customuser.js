'use strict';

module.exports = function(customUser) {
customUser.searchRingCentralUser = function(name, callback) {
	customUser.find({
	  limit: 30,
	  where:{searchName:{like: '%'+ name +'%'}}}).then(async function(users){
	  	callback(null,users);
	  });
};
};
