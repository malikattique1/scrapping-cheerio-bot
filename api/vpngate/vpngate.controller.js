
var bcrypt = require('bcrypt');
var config = require('../../config.js'); 

const {
  loginuserbyemail,
  createuser,
  getvpns,
  getvpnlinkfromid,
  
} = require("./vpngate.service");

const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {

  login: (req, res) => {
    const body = req.body;
    loginuserbyemail(body.email, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: 0,
          data: "Invalid email or password"
        });
      }
      // console.log(results);
      const result = bcrypt.compareSync(body.password, results.password);
      // console.log(result);
      if (result) {
        results.password = undefined;
        const jsontoken = sign({ result: results }, config.secret, {
          // expiresIn: "1h"
        });
        return res.json({
          success: 1,
          message: "login successfully",
          token: jsontoken
        });
      } else {
        return res.json({
          success: 0,
          data: "Invalid email or password"
        });
      }
    });
  },
  createuser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    createuser(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: err.code,
          message: err.sqlMessage
        });
      }
      return res.status(200).json({
        success: 1,
        message: results
      });
    });
  },


  getvpns: (req, res) => {
    getvpns((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        data: results
      });
    });
  },

  getvpnlinkfromid: (req, res) => {
    const id = req.params.id;
    getvpnlinkfromid(id, (err, results) => {
      // console.log(results)
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: err
        });
      }
      else if (!results) {
        return res.json({
          success: 0,
          message: "Record not Found"
        });
      }
      else if(results=='Error pinging'){
        return res.json({
          success:0,
          data: results
        });
      }
      else if(results=='no result found'){
        return res.json({
          success:0,
          data: results
        });
      }
      else{
      return res.json({
        success:1,
        data: results
      });
    }
    });
  },


};
