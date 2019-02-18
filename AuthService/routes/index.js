const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const request = require('request');

const { secret, serviceUrls } = require('../config');

router.post('/login', (req, res) => {
  console.log(req.body.username,req.body.password,req.body.type);
  var username = req.body.username;
  var password = req.body.password;
  var type = req.body.type;
  if(type === "commercial"){
    if(username && password) {
      request
        .get(`${serviceUrls.dbUrl}/users`, (err, response, body) => {
            if(err) {
                res.status(500).json({
                    errorMsg: 'User data not available'
                }); 
            }
            let users = JSON.parse(body);
            users = users.filter(user => user.type ==="commercial")
            console.log(users);
            if(users instanceof Array) {
                let userData = users.filter(user => user.username == username && user.password == password);
                if(userData.length>0) {
                    let token = jwt.sign({ username: username }, secret, { expiresIn: 86400 });
                    res.status(200).json({
                      authenticated: true,
                      token : token,
                      type : "commercial"
                    })
                } else {
                  res.status(401).json({
                    errorMsg: 'Unauthorized: Username or Password is incorrect'
                  })
                }
            }
        });
      } else {
        res.status(400).json({
          errorMsg: 'Bad request: Username or Password is not provided'
        })
      }
    } else if(type ==="retail"){
      if(username && password) {
        request
          .get(`${serviceUrls.dbUrl}/users`, (err, response, body) => {
              if(err) {
                  res.status(500).json({
                      errorMsg: 'User data not available'
                  }); 
              }
              let users = JSON.parse(body);
              users = users.filter(user => user.type==="retail");
              console.log(users);
              if(users instanceof Array) {
                  let userData = users.filter(user => user.username == username && user.password == password);
                  if(userData.length>0) {
                      let token = jwt.sign({ username: username }, secret, { expiresIn: 86400 });
                      res.status(200).json({
                        authenticated: true,
                        token : token,
                        type : "retail"
                      })
                  } else {
                    res.status(401).json({
                      errorMsg: 'Unauthorized: Username or Password is incorrect'
                    })
                  }
              }
          });
        } else {
          res.status(400).json({
            errorMsg: 'Bad request: Username or Password is not provided'
          })
        }
    }else{
      res.status(400).json({
        errorMsg: 'Bad request'
      })
    }
});

router.get('/authenticate', function(req, res){
  try{
    var token = req.headers['x-access-token'];

  jwt.verify(token, secret , function(err, decodedObj){
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    res.status(200).send(decodedObj);
  })
  }
  catch(err)
  {
    console.log(err);
  }
  
});

module.exports = router;
