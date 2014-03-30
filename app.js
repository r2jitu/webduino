var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , jf = require('jsonfile')
  , util = require('util')

if (process.argv.length < 3) {
  console.log('Need to specify a config file');
  return;
}

var config = jf.readFileSync(process.argv[2]);
console.log('Using config: ' + util.inspect(config));

app.listen(8080);

function handler(req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

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

io.sockets.on('connection', function (socket) {
  socket.on('led toggle', function (data) {
    var device = devices[data.device];
    if (device && device.board) {
      var board = device.board;
      var isLedOn = device.isLedOn = !device.isLedOn;
      board.digitalWrite(13, isLedOn ? board.HIGH : board.LOW);
    }
  });

  if (devices['robot']) {
    devices['robot'].bindSocket(socket);
  }

  socket.on('disconnect', function () {
  });
});
