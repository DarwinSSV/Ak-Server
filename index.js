const express = require('express')
const app = express()
const nodemailer = require('nodemailer')
const port = 3300
var cors = require('cors')
var path = require('path');
require("dotenv").config();

app.use(cors({ origin: process.env.REMOTE_CLIENT_APP, credentials: true }));



const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://akstore:Fish%40Sea007@cluster0.tapm5.mongodb.net/test";
const databaseName = "akstore";

app.use(cors())

app.use(express.json());

app.listen(port, (req,res) => {
  console.log(`Example app listening on port ${port}`);
})

app.get('/admin', (req,res) => {
  res.sendFile(path.join(__dirname+'/form.html'));
})

app.get('/upload', (req,res) => {
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("akstore");
    var myobj = { 
      sku: req.query.product_sku,
      product: req.query.product_name,
      quantity: req.query.product_quantity,
      category: req.query.product_category,
      measurement: req.query.product_measurement,
      mrp: req.query.product_mrp,
      price: req.query.product_sale_price
    };

    let check_empty = Object.values(myobj).every(o => o === null);

    /*let check = (myobj) => {
      for(const key of Object.keys(myobj)) {
        if (myobj[key] === null) {
              return true
          }
      }
    }*/
    
    //db.akstore.update({}, { "$set" : { "age": 30 }}, false,true)

    if( !check_empty ) {

    dbo.collection("inventory").insertOne(myobj, function(err, req, ress) {
      if (err) {
        throw err;
      } else {
        console.log("OK");
        let message = "Added Successfully";
        //res.json( "Product Added Successfully" );
      }
      res.json("1 document inserted");
      db.close();
    });
  } else {
    console.log( "Form has null value" );
    ress.json( "Form has null value" );
    db.close();
  }
  });
})

app.get('/',(req,res)=> {
  MongoClient.connect(uri, { useNewUrlParser: true }, (error, client) => {
    if (error) {
      return console.log(error);
    }
    console.log("Connection established - All well");
    const db = client.db('akstore');
    db.collection("inventory").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(`API is Working. See Result -> Localhost:${port}`);
      res.send(result);
      db.close();
    });

  });
  
})

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: "576",
  service: "gmail",
  auth: {
    user: 'darpart19@gmail.com',
    pass: 'R@ee@tha.07'
  }
})

app.post('/sendmail', function(req,res) {
  //res.send("got data");
  console.log( req.body );

return;

  var mailOptions = {
    from: "darpart19@gmail.com",
    to: "darwinslearning@gmail.com",
    subject: "Testing Node Mail",
    text: "Sample text"
  }

  transporter.sendMail( mailOptions, ( err, info ) => {
    if(!err) {
      res.send( "mail sent" )
    } else {
      res.send( "Mail Error" )
    }
  })
})