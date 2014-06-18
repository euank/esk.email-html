function getCookie(key) {
  return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
}

function rmCookie(key) {
  document.cookie = key + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

function jsonRequest(type, url, data, cb) {
  if(typeof data == "function") {
    cb = data;
    data = null;
  } else if(typeof data === 'object') {
    data = JSON.stringify(data);
  }
  var req = new XMLHttpRequest();
  req.open(type, url, true);
  req.onerror = function() {
    cb("Connection error");
  };
  req.onload = function() {
    var data;
    if (req.status >= 200 && req.status < 400){
      try {
        data = JSON.parse(req.responseText);
      } catch(ex) {
        return cb(ex);
      }
      if(data.error) {
        return cb(data.error);
      }
      return cb(null, data);
    } else {
      try {
        data = JSON.parse(req.responseText);
      } catch(ex) {
        data = req.responseText;
      }
      cb(req.status, data);
    }
  };
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(data);
}
