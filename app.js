require("dotenv").config();

const express = require("express");
const app = express();

const userRouter = require("./api/vpngate/vpngate.router");
const userRouter13 = require("./api/web_search_vpngate/searchGoogle.router");
app.use(express.json());


app.use("/api/vpndata", userRouter);
app.use("/api/vpndata/scrapping", userRouter13);
time="10"; //10 min
setInterval(function() {
  var request = require('request');
  request('http://localhost:4000/api/vpndata/scrapping/search', function (error, response, body) {
  // request('https://vpn.funsdevops.com/api/vpndata/scrapping/search', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) 
  }
})
},time*60*1000)

// app.listen();

const port = process.env.APP_PORT;
app.listen(port, () => {
  console.log("server up and running on PORT :", port);
});
