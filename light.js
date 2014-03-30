var arduino = require('duino')

var Light = function (descriptor) {
  this.board = new arduino.Board({
    debug: true,
    device: descriptor.device
  });
};

exports.create = function (descriptor) {
  return new Light(descriptor);
};

