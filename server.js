var express = require('express');
var MessagingResponse = require('twilio').twiml.MessagingResponse;
var app = express();
var PORT = process.env.PORT || 9090 ;

// app.use(express.static(path.resolve(__dirname, 'public')));

app.get("/", function (req, res) {
  res.send("Running smooth!");
});

app.post('/sms', (req, res) => {
    var twiml = new MessagingResponse();

    // TODO: Figure out how to grab text from user message
    // console.log(req.body);
    // console.log(res);
    
  twiml.message('BulkyBot hears you!!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    process.exit();
  }
  console.log(`listening on port ${PORT}`);
});