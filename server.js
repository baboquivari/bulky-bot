const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const axios = require('axios');
const moment = require('moment');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000; // NEED TO CHANG THIS TO 9090 when hosting on HEROKU

// HELPER FUNCS
const hasNumber = str => /\d/.test(str);

// Parses incoming request bodies
app.use(bodyParser());


app.get("/", function (req, res) {
  res.send("Running smooth!");
});

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  const textBody = req.body.Body;
  let date;
  let protein;
  let calories;

  switch (textBody) {
    case 'Hey': twiml.message('Hey hey hey!');
      break;
    case 'Yo': twiml.message('Whadddup!');
      break;
    case 'Say hello to Jim': twiml.message('Alright Jim!');
      break;
    default: { // THIS IS THE MEAT AND BONES OF BULKYBOT
      if (hasNumber(textBody)) {
        // ADD PROTEIN AND CALORIE VALUES TO MONGODB, ALONG WITH TODAY'S DATE
        // THEN READ DATABASE AND USE DATA TO COMPOSE TWIML RESPONSE.
        
      } else { // IF THERE'S NO NUMBERS IN THE TEXT BODY
        twiml.message('BulkyBot hears you!')
        writeHead();
      }

      return;
    };
  }

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
