require("dotenv").config();
const express = require("express");
const app = express();
const userRouter = require("./api/users/user.router");
const customerRouter = require("./api/customer/customer.router");
var bodyParser = require("body-parser");

var fs = require("fs");
var http = require("http");
var https = require("https");
// var privateKey = fs.readFileSync("./key.pem", "utf8");
// var certificate = fs.readFileSync("./certificate.pem", "utf8");

var privateKey = fs.readFileSync("./ssl/private.key", "utf8");
var certificate = fs.readFileSync("./ssl/certificate.crt", "utf8");
var ca = fs.readFileSync("./ssl/ca_bundle.crt", "utf8");

var credentials = { 
  key: privateKey, 
  cert: certificate,
  ca: ca
 };

app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use("/api/users", userRouter);
app.use("/api/customer", customerRouter);

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(process.env.APP_PORT || 10000, () => {
  console.log("Server is running on port : ", process.env.APP_PORT);
});

httpsServer.listen(process.env.APP_PORT_HTTPS || 3000, () => {
  console.log("Https Server is running on port : ", process.env.APP_PORT_HTTPS);
});

// app.listen(process.env.APP_PORT || 3000, () => {
//   console.log("Server is running on port : ", process.env.APP_PORT);
// });nodemon app
