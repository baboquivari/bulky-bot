const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const axios = require('axios');
const moment = require('moment');
const mongoose = require('mongoose');
const Macro = require('./model.js');
const today = moment().format("MMM Do YY");

const PORT = process.env.PORT || 3000; // NEED TO CHANG THIS TO 9090 when hosting on HEROKU

// CONNECT TO A MONGO DATABASE (EITHER LOCAL OR HOSTED). 'TEST' IS AUTOGENERATED ALWAYS BY MONGODB 
// IN THIS INSTANCE I'M GONNA CONNECT TO MY MLAB 'BULKBOT' DATABASE, WOO!
mongoose.connect('mongodb://Tony:password@ds143734.mlab.com:43734/bulkybot');

// HELPER FUNCS
const hasNumber = str => /\d/.test(str); 

// Parses incoming request bodies
app.use(bodyParser());


app.get("/", function (req, res) {
  res.send("Running smooth!");
});

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  let textBody = req.body.Body;
  let date;
  let protein;
  let calories;
  let dailyTotal;

  switch (textBody) {
    case 'Hey': twiml.message('Hey hey hey!');
      break;
    default: { // THIS IS THE MEAT AND BONES OF BULKYBOT
      if (hasNumber(textBody)) {
        textBody = textBody.split(' ');

        // SAVE PROTEIN/CALORIES TO THE MLAB DB
        new Macro({
          date: today,
          protein: Number(textBody[0]),
          calories: Number(textBody[1])
        })
        .save((err) => {
            if (err) console.log("ERROR");
        })

        // THIS WHOLE THING FRIKKIN WORKS! SUCCESSFULLY ADDING EACH ENTRY INTO DB
        
        // NOW GOTTA READ FROM THE DB - ALL OF TODAY'S ENTRIES
        Macro.find({date: today}, (err, result) => {
          if (err) console.log("ERROR!");
      
          // RES IS JUST NICE TIDY JSON
      
          // WANNA NOW LOOP THROUGH ALL RETURNED JSON OBJECTS AND CALCULATE TOTAL PROTEIN AND CALORIES, USING THIS TO CREATE THE TWIML RESPONSE. BOOYA!
          dailyTotal = result.reduce((acc, entry) => {
            acc[0] += entry.protein;
            acc[1] += entry.calories;

            return acc;
          }, [0, 0])

          // TODO: JUST GOTTA FIX THE MATH HERE!! Returning weird results sometimes at start of day
          twiml.message(`
          Daily totals:
          Protein: ${dailyTotal[0] + Number(textBody[0])}
          Calories: ${dailyTotal[1] + Number(textBody[1])}
          
          Keep it up! :)
          `);
    
          res.writeHead(200, {'Content-Type': 'text/xml'});
          res.end(twiml.toString());
      })

      
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
