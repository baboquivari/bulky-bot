var http = require('http');
var express = require('express');
var MessagingResponse = require('twilio').twiml.MessagingResponse;
var app = express();

app.post('/sms', (req, res) => {
    var twiml = new MessagingResponse();

    // TODO: Figure out how to grab text from user message
    console.log(req.body);
    console.log(res);
    
  twiml.message('BulkyBot hears you!!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});