var qs = function(selector) {
  return document.querySelector(selector);
};

var els = {};
["loadingdiv", "logindiv", "managediv"].forEach(function(el) {
  els[el] = qs('#' + el);
});

function setLoginEmail() {
  var email;
  if((email = getCookie("email"))) {
    var span = qs("#login-email");
    while(span.firstChild) span.removeChild(span.firstChild);
    span.appendChild(document.createTextNode(email));
  }
}

function hideAll() {
  Object.keys(els).forEach(function(elkey) {
    els[elkey].classList.add('hide');
  });
}
function showLoginBox() {
  hideAll();
  els.logindiv.classList.remove('hide');
}
function showManageBox() {
  hideAll();
  els.managediv.classList.remove('hide');
}

function checkLoggedIn() {
  if(getCookie('session')) {
    jsonRequest('GET', '/api/login', function(err, res) {
      if(err) return alert(err);
      if(!res.logged_in) {
        return showLoginBox();
      } else {
        return showManageBox();
      }
    });
  } else {
    showLoginBox();
  }
}

document.querySelector('#loginbtn').onclick = function(event) {
  event.preventDefault();
  var email = qs("#email").value;
  var password = qs("#password").value;
  jsonRequest('POST', "/api/login", {email: email, password: password}, function(err, res) {
    if(err) alert(err);
    else {
      if(res.ok) {
        document.cookie = "session=" + res.session;
        document.cookie = "email=" + email;
        setLoginEmail();
        qs("#password").value = '';
        qs("#email").value = '';
        showManageBox();
      } else {
        alert("Error logging in" + res);
      }
    }
  });
};

document.querySelector("#logoutbtn").onclick = function() {
  jsonRequest('DELETE', '/api/login', function(err, res) {
    if(err) alert(err);
    rmCookie('session');
    showLoginBox();
  });
};

document.querySelector("#changepassbtn").onclick = function() {
  var oldpass = qs("#oldpass").value;
  var newpass = qs("#newpass").value;
  var email = getCookie("email");
  jsonRequest('POST', '/api/password', {email: email, oldpassword: oldpass, newpassword: newpass}, function(err, res) {
    if(err) alert(err);
    else alert("All good");
    qs("#oldpass").value = qs("#newpass").value = '';
  });
};
document.querySelector("#invitebtn").onclick = function() {
  jsonRequest('POST', '/api/invite', {email: getCookie("email")}, function(err, res) {
    if(err) {
      alert(err);
    } else if(res.ok) {
      alert("Check your inbox!");
    } else {
      alert("Unknown error: " + JSON.stringify(res));
    }
  });
};

checkLoggedIn();
setLoginEmail();
