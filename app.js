var express = require('express');
var request = require('request');
var appd = require("appdynamics-node-native-wrapper");

var app = express();


appd.profile(
        "www.controller.com",
        8090,
        false,
        "customer1",
        "access-key",
        "Node C++ Wrapper",
        "frontend",
        "frontend-baller",
        appd.LOG_LEVELS.APPD_LOG_LEVEL_TRACE,
        "D:/appd-logs/"
);


appd.backendDeclare(appd.BACKEND_TYPES.APPD_BACKEND_HTTP, "google");
appd.backendSetIdentifyingProperty("google", "HOST", "www.google.com");
appd.backendAdd("google");


app.use(appd.appDMiddleware);

app.get('/', function (req, res) {
  console.log(req.headers);

  var exitCall = appd.exitCallBegin(req.headers.appd_btID, "google");
  appd.exitCallSetDetails(exitCall, "Calling google with https");

  var options = {
    url: 'http://localhost:3001',
    headers: {
      "singularityheader": appd.exitCallGetCorrelationHeader(exitCall)
    }
  };

  var callback = function(error, response, body){
    if(error){
      res.send('Error! ' + error);
      console.log(error);
      appd.exitCallEnd(exitCall);
      return;
    }
    console.log('Backend, HTTP', response.statusCode);
    appd.exitCallEnd(exitCall);
    res.send('Hello World!');
    return;
}
  request(options, callback);

});

app.get('/error', function (req, res) {
  console.log(req.headers);

  var exitCall = appd.exitCallBegin(req.headers.appd_btID, "google");
  appd.exitCallSetDetails(exitCall, "Calling google with https");

  var options = {
    url: 'http:/localhost:3001',
    headers: {
      "singularityheader": appd.exitCallGetCorrelationHeader(exitCall)
    }
  };

  var callback = function(error, response, body){
    if(error){
      res.send('Error! ' + error);
      console.log(error);
      appd.btAddError(req.headers.appd_btID, appd.ERROR_LEVELS.APPD_LEVEL_ERROR, error, true);
      appd.exitCallEnd(exitCall);
      return;
    }
    console.log('Backend, HTTP', response.statusCode);
    appd.exitCallEnd(exitCall);
    res.send('Hello World!');
    return;
}
  request(options, callback);

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});