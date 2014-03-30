var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , arduino = require('duino')

var deviceDescriptors = {
  light: {
    device: '/dev/serial/by-id/usb-Arduino__www.arduino.cc__0043_753303039343513031E1-if00'
  },
  robot: {
    device: '/dev/serial/by-id/usb-Arduino__www.arduino.cc__0043_75330303934351202011-if00'
  }
};

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

var boards = {};

for (var deviceName in deviceDescriptors) {
  var descriptor = deviceDescriptors[deviceName]
  if (fs.existsSync(descriptor.device)) {
    console.log('Connected device: ' + deviceName);
    boards[deviceName] = {
      board: new arduino.Board({
        debug: true,
        device: descriptor.device
      }),
      isLedOn: false
    };
  }
}

var PWM_R = 5;
var PWM_L = 10;
var DIR_R = 4;
var DIR_L = 12;
var ROBOT_LED = 13;

io.sockets.on('connection', function (socket) {
  socket.on('led toggle', function (data) {
    var boardInfo = boards[data.device];
    if (boardInfo) {
      var board = boardInfo.board;
      var isLedOn = boardInfo.isLedOn = !boardInfo.isLedOn;
      board.digitalWrite(13, isLedOn ? board.HIGH : board.LOW);
    }
  });

  socket.on('analogWrite', function (data) {
    console.log('analogWrite(11,' + data.value + ')');
    board.analogWrite(11, data.value);
  });

  socket.on('robot', function (data) {
    console.log(data)
    if (boards['robot']) {
      var boardInfo = boards['robot'];
      var board = boardInfo.board;
      if ('left' in data) {
        if (data.left == 0) {
          board.analogWrite(PWM_L, 0);
        } else {
          board.analogWrite(PWM_L, Math.abs(data.left));
          board.digitalWrite(DIR_L, data.left < 0 ? board.HIGH : board.LOW);
        }
      }
      if ('right' in data) {
        if (data.right == 0) {
          board.analogWrite(PWM_R, 0);
        } else {
          board.analogWrite(PWM_R, Math.abs(data.right));
          board.digitalWrite(DIR_R, data.right < 0 ? board.HIGH : board.LOW);
        }
      }
    }
  });

  socket.on('disconnect', function () {
  });
});