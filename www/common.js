var socket = io.connect();

/* socket.on('devices', function(devices) {
  var deviceSelector = document.createElement('div');
  deviceSelector.appendChild(document.createElement('hr'));
  deviceSelector.appendChild(document.createTextNode('Select a device: '));

  var dropdown = document.createElement('select');
  for (var i = 0; i < devices.length; i++) {
    var option = document.createElement('option');
    option.value = devices[i];
    option.appendChild(document.createTextNode(devices[i]));
    if (window.location.pathname.indexOf(devices[i] + '.html') !== -1) {
      option.selected = true;
    }
    dropdown.appendChild(option);
  }

  dropdown.onchange = function() {
    var selected = this.options[this.selectedIndex].value;
    window.location.href = selected + ".html";
  };
  deviceSelector.appendChild(dropdown);
  document.body.appendChild(deviceSelector);
});*/
