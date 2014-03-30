var arduino = require('duino')

var Light = function (descriptor) {
  this.board = new arduino.Board({
    debug: true,
    device: descriptor.device
  });
};

var PIN_MULTI_RED = 3;
var PIN_MULTI_GREEN = 5;
var PIN_MULTI_BLUE = 6;
var PIN_GREEN1 = 9;
var PIN_GREEN2 = 10;
var PIN_GREEN3 = 11;

Light.prototype.bindSocket = function (socket) {
  socket.on('light', (function (data) {
    var _hue = data.hue;
    var _brightness = data.brightness / 100.0;
    var _sat = 1;

    var red = 0.0;
    var green = 0.0;
    var blue = 0.0;

    if (_sat == 0.0) {
        red = _brightness;
        green = _brightness;
        blue = _brightness;
    } else {
        if (_hue == 360.0) {
            _hue = 0;
        }

        var slice = Math.floor(_hue / 60.0);
        var hue_frac = (_hue / 60.0) - slice;

        var aa = _brightness * (1.0 - _sat);
        var bb = _brightness * (1.0 - _sat * hue_frac);
        var cc = _brightness * (1.0 - _sat * (1.0 - hue_frac));

        switch(slice) {
            case 0:
                red = _brightness;
                green = cc;
                blue = aa;
                break;
            case 1:
                red = bb;
                green = _brightness;
                blue = aa;
                break;
            case 2:
                red = aa;
                green = _brightness;
                blue = cc;
                break;
            case 3:
                red = aa;
                green = bb;
                blue = _brightness;
                break;
            case 4:
                red = cc;
                green = aa;
                blue = _brightness;
                break;
            case 5:
                red = _brightness;
                green = aa;
                blue = bb;
                break;
            default:
                red = 0.0;
                green = 0.0;
                blue = 0.0;
                break;
        }
    }

    var ired = Math.floor(red * 255.0);
    var igreen = Math.floor(green * 255.0);
    var iblue = Math.floor(blue * 255.0);
    var ibrightness = Math.floor(_brightness * 255.0);

    this.board.analogWrite(PIN_MULTI_RED, ired);
    this.board.analogWrite(PIN_MULTI_GREEN, igreen);
    this.board.analogWrite(PIN_MULTI_BLUE, iblue);
    this.board.analogWrite(PIN_GREEN1, ibrightness);
    this.board.analogWrite(PIN_GREEN2, ibrightness);
    this.board.analogWrite(PIN_GREEN3, ibrightness);
  }).bind(this));
};

exports.create = function (descriptor) {
  return new Light(descriptor);
};

