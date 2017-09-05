const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const app = express();
const bodyParser = require('body-parser');
const google = require('googleapis');
const axios = require('axios');
const moment = require('moment');
const spreadsheetId = '1gEKLQVkBrJjl-UG0K10itiQ3C3Drbq7o2ESammDGbUI';
const range = 'Sheet1!A2:C2';
const API_KEY = process.env.API_KEY;
// FIXME: Get rid of this explicit key BEFORE pushing to HEROKU!!!!!!!!!
const PORT = process.env.PORT; // NEED TO CHANG THIS TO 9090 when hosting on HEROKU

// HELPER FUNCS
const hasNumber = str => /\d/.test(str);

// Parses incoming request bodies
app.use(bodyParser());

app.get("/", function (req, res) {
  res.send("Running smooth!");
});

// google auth will redirect back to here after authorisation - MUST match "redirect uri" field in the Google Console
app.get("/redirect", (req, res) => {  
  console.log("Redirect successful - OAUTH implemented!");
  console.log(req);
  res.send("This shit working!" + req.uri.href); 

  // NOW WE HAVE TO EXTRACT THE RETURNED AUTH CODE (IT'S IN THE URL AT THE MOMENT) AND THEN CALL THE BELOW URL TO
  // GET A TOKEN. THEN, WE CAN ACCESS THESE SPREADSHEETS WILLY NILLY.

  // axios
  //   .get(`https://www.googleapis.com/oauth2/v4/token`)
})

///////////////////////////////////////////////////////////////////////////////////////

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  const textBody = req.body.Body;
  let date;
  let protein;
  let calories;
  getTextData(textBody);
  console.log(date);

  switch (textBody) {
    case 'Hey': twiml.message('Hey hey hey!');
      break;
    case 'Tell Jaydon he\'s a goobis': twiml.message('Jaydon, you are indeed a goobis.');
      break;
    case 'Yo': twiml.message('Whadddup!');
      break;
    case 'Say hello to Jim': twiml.message('Alright Jim!');
      break;
    default: { // THIS IS THE MEAT AND BONES OF BULKYBOT
      if (hasNumber(textBody)) {
        // the return INSTANCE from Google Sheets is called ValueRange
        axios
          // I made this sheet public - have a go at making it private with OAuth one day
          .get(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${API_KEY}`)
          .then(googleRes => { // READ DATA
            const pro = Number(googleRes.data.values[0][1]); 
            const cal = Number(googleRes.data.values[0][2]);

            console.log(pro);
            console.log(protein, calories);


            twiml.message(`Your daily totals:\nProtein: ${protein + (pro || 0)}\nCalories: ${calories + (cal || 0)}`);
            writeHead();
          })
          .catch(err => {
            console.log('ERROR' + err);
            twiml.message('FAILED - Something done gone wrong :(');
            writeHead();            
          })
        
        // Grab text-message string e.g. "30 500" and split it into 2 values
        // It then needs to make a GET request to a Google Sheet for today's protein/calorie values
          // In the GET callback it needs to access these values (e.g. 60 1100), ADD on the user string (90 1600) and then send a response back to the user with formatted text containing these new values, using TWIML.
        // Lastly, it needs to make a POST request to a Google Spreadsheet with these new values and update the row for today's date. 
      } else {
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
