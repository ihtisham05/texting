// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

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
      socket.on('newMessage', (data) => {
        data.current_date_time = new  Date();
      user.find({where:{mobile:data.phoneNumber_from}}).then(async function(userFound){
        if(userFound.length){
          console.log("inside if");
          await msg.create({text:data.message,createdAt:data.current_date_time,from:userFound[0].id,read:0});
          await socket.broadcast.emit('fMessageFromRing', data);
          
        }else{
          await user.create({mobile:data.phoneNumber_from,fname:data.fname,lname:data.lname});
          await msg.create({text:data.message,createdAt:data.current_date_time,from:userFound[0].id,read:0});
          await socket.broadcast.emit('fMessageFromRing', data);
        }
        console.log("new message from stephen",data);
      });
        
      });
      socket.on('newMessageFromF',async function(data){
        console.log("newMessageFromF called",data.message);
        // createdAt:data.current_date_time,from:data.from,read:0
        await msg.create({text: data.message,createdAt:data.createdAt,from:data.from,read:0});
        await socket.broadcast.emit('newRingCentralMessage', data);
      });
      socket.on('disconnect', () => {
        console.log("User disconnected");
      });
    });
});
