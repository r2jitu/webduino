var arduino = require('duino')

var PWM_R = 5;
var PWM_L = 10;
var DIR_R = 4;
var DIR_L = 12;
var ROBOT_LED = 13;

var Robot = function (descriptor) {
  this.board = new arduino.Board({
    debug: true,
    device: descriptor.device
  });
};

Robot.prototype.setLeft = function (value) {
  if (value == 0) {
    this.board.analogWrite(PWM_L, 0);
  } else {
    this.board.analogWrite(PWM_L, Math.abs(value));
    this.board.digitalWrite(DIR_L, value < 0 ? this.board.HIGH : this.board.LOW);
  }
};

Robot.prototype.setRight = function (value) {
  if (value == 0) {
    this.board.analogWrite(PWM_R, 0);
  } else {
    this.board.analogWrite(PWM_R, Math.abs(value));
    this.board.digitalWrite(DIR_R, value < 0 ? this.board.HIGH : this.board.LOW);
  }
};

Robot.prototype.bindSocket = function (socket) {
  socket.on('robot', (function (data) {
    if ('left' in data) {
      this.setLeft(data.left);
    }
    if ('right' in data) {
      this.setRight(data.right);
    }
  }).bind(this));
};

exports.create = function (descriptor) {
  return new Robot(descriptor);
};

