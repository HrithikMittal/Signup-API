var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Details = require('./app/models/details');
var MongoClient = require('mongodb').MongoClient;

// Configure app for bodyParser()
// lets us grab data from the body of POST
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Set up port for server to listen on
var port = process.env.PORT || 3001;

// Connect to DB
var url = 'mongodb+srv://hrithik:hrithik123@users-6oe1e.gcp.mongodb.net/test?retryWrites=true';
MongoClient.connect(url, (err, db) => {
  const dbo = db.db("test");

  //API Routes
  var router = express.Router();

  // Routes will all be prefixed with /API
  app.use('/api', router);

  //MIDDLE WARE-
  router.use(function (req, res, next) {
    console.log('FYI...There is some processing currently going down');
    next();
  });

  // test route
  router.get('/', function (req, res) {
    res.json({
      message: 'Welcome !'
    });
  });

  router.route('/details')
    .post(function (req, res) {
      let status = true;
      var person = new Details();
      person.bname = req.body.bname;
      person.pno = req.body.pno;
      person.email = req.body.email;
      person.baddress = req.body.baddress;

      dbo.collection("details").find({}).toArray(function (err, result) {
        if (err) throw err;
        for (var i = 0; i < result.length; i++) {
          if (person.pno == result[i].pno) {
            status = false;
          }
        }
        if (status == true) {
          dbo.collection("details").insertOne(person, function (err, rese) {
            if (err) throw {
              message: "Error comes " + err.message,
            };
            console.log("1 document inserted sucessfully");
            // res.send do not work here 
          });
        }
        res.send("Proccess successfully done...");
        return status;
      });
    })
    .get(function (req, res) {
      Details.find(function (err, details) {
        if (err) {
          res.send(err);
        }
        res.json(details);
      });
    });
});
// Fire up server
app.listen(port);

// print friendly message to console
console.log('Server listening on port ' + port);
