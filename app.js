var http = require('http')
  , connect = require('connect')
  , fs = require('fs')
  , jf = require('jsonfile')
  , util = require('util')

if (process.argv.length < 3) {
  console.log('Need to specify a config file');
  return;
}

var config = jf.readFileSync(process.argv[2]);
console.log('Using config: ' + util.inspect(config));

// Load the devices
var devices = {};
for (var deviceName in config.devices) {
  var descriptor = config.devices[deviceName];
  if (fs.existsSync(descriptor.device)) {
    var deviceModule = require(descriptor.module);
    devices[deviceName] = deviceModule.create(descriptor);
    console.log('Connected device: ' + deviceName);
  } else {
    console.log('Device "' + deviceName + '" not found');
  }
}

// Start the web server
var app = connect()
    .use(connect.logger('dev'))
    .use(connect.static('www'))
var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(8080);

// Listen to web sockets
io.sockets.on('connection', function (socket) {
  //socket.emit('devices', Object.keys(devices));
  socket.emit('devices', Object.keys(config.devices));

  socket.on('led toggle', function (data) {
    var device = devices[data.device];
    if (device && device.board) {
      var board = device.board;
      var isLedOn = device.isLedOn = !device.isLedOn;
      board.digitalWrite(13, isLedOn ? board.HIGH : board.LOW);
    }
  });

  if (devices['light']) {
    devices['light'].bindSocket(socket);
  }

  if (devices['robot']) {
    devices['robot'].bindSocket(socket);
  }

  socket.on('disconnect', function () {
  });
});
