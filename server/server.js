// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License message available at https://opensource.org/licenses/MIT

'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var socketIO = require("socket.io");
var app = module.exports = loopback();
var io={};
app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    // app.start();
      io = require('socket.io')(app.start());

      io.on('connection', (socket) => {
      var msg = app.models.message;
      var user = app.models.customuser;
      console.log("New user connected: ",socket.id);
      socket.on('newMessage', (datas) => {
        datas = JSON.parse(datas);
      	console.log("new message from stephen -----",datas);
        for(let data of datas.records){
        // var sName = data.fname +" "+ data.lname;
        let rizObj =   {
            "fname": 'fname',
            "lname": 'lname',
            "message": data.subject,
            "phoneNumber_from": data.from.phoneNumber,
            "phoneNumber_to": '44444',
            "csv_id": 'A345K4kls90',
            "current_date_time": new Date(),
            "for":1
          }
        data.current_date_time = new  Date();
      user.find({where:{mobile:data.from.phoneNumber}}).then(async function(userFound){
        if(userFound.length){
          await msg.create({message:data.subject,createdAt:data.current_date_time,from:userFound[0].id,for:1,read:0});
          await socket.broadcast.emit('fMessageFromRing', rizObj);
          
        }else{
          var newUser = await user.create({mobile:data.from.phoneNumber,fname:"fname",lname:"lname",searchName:"fname lname",type:"ringCentral"});
          //XXX await msg.create({message:data.message,createdAt:data.current_date_time,from:newUser.id,for:1,read:0});
          await socket.broadcast.emit('fMessageFromRing', rizObj);
        }
        
      });
        
        }
      });
      socket.on('newMessageFromF',async function(data){
        console.log("newMessageFromF called",data.message);
        // createdAt:data.current_date_time,from:data.from,read:0
        await msg.create({message: data.message,createdAt:data.createdAt,from:data.from,for:1,read:0,type:data.type});
        await socket.broadcast.emit('newRingCentralMessage', data);
      });
      socket.on('disconnect', () => {
        console.log("User disconnected");
      });
    });
});
