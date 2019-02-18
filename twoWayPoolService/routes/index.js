var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../data/config');
var serviceUrlConfig = require("../data/serviceURL's");
var axios = require('axios');
var request = require('request');
var fs = require('fs');

router.post('/populateInstruction', function (req, res) {

  let token = req.headers['x-access-token'];
  let controlBankDetails = req.body.controlBank;
  let contraBankDetails = req.body.contraBank;
  let targetAmount = parseInt(req.body.target);

  jwt.verify(token, config.secret, function (err, decodedObj) {
    if (err) return res.status(500).json({
      auth: false,
      message: 'Failed to authenticate token.'
    });
    let userName = decodedObj.username;
    let data = {};
    axios.get(`${serviceUrlConfig.dbUrl}/${userName}-instructions`)
      .then((resp) => {
        Object.assign(data, resp.data);
        let resObj = {
          instructionID: parseInt(data['instruction-list'].length) + 1001,
          priorityID: parseInt(data['instruction-list'].length) + 1,
          controlBank: controlBankDetails.bankName,
          controlBankAccountNumber: controlBankDetails.value,
          controlBankID: controlBankDetails.bankID,
          contraBank: contraBankDetails.bankName,
          contraBankID: contraBankDetails.bankID,
          contraBankAccountNumber: contraBankDetails.value,
          target: targetAmount
        }
        let finalData = data['instruction-list'];
        finalData.push(resObj);
        request.patch({
          url: serviceUrlConfig.dbUrl+'/'+userName+'-instructions',
          body: {
            'instruction-list': finalData
          },
          json: true
        }, function(err, response, body){
          if(err) return res.status(500).json({ message: 'Failed to patch data'})
          res.status(200).json(body);
        })
      });
  });
});

router.get('/transaction', function (req, res, next) {
  let token = req.headers['x-access-token'];
  let result = [];

  jwt.verify(token, config.secret, function (err, decodedObj) {
    if (err) return res.status(500).json({
      auth: false,
      message: 'Failed to authenticate token.'
    });
    let userName = decodedObj.username;

    axios.get(`${serviceUrlConfig.dbUrl}/${userName}-instructions`)
    .then((resp) => {
      let instrObj = Object.assign(instrObj, resp.data);
    })
    

    // let len = instrObj[userName].instructions.length;

    // let controlBank, contraBank, target, controlBankBalance, contraBankBalance, contraBankMinBalance;

    // //to get last value of ID	
    // for (i = 0; i < len; i++) {
    //   controlBank = instrObj[userName].instructions[i].controlBank;
    //   contraBank = instrObj[userName].instructions[i].contraBank;
    //   target = instrObj[userName].instructions[i].controlBank;
    //   priorityId = instrObj[userName].instructions[i].priorityId;

    //   request.get(serviceUrlConfig.dbUrl + '/' + userName + '-commercial', function (err, response, body) {
    //     if (err) return res.status(500).json({
    //       message: 'Failed to load data'
    //     })
    //     // console.log(body, postData.transfers);
    //     var data = JSON.parse(body);

    //     var filteredControlBank = data.banks.filter((bank) => {
    //       return bank.bankName == controlBank;
    //     })[0];
    //     var filteredContraBank = data.banks.filter((bank) => {
    //       return bank.bankName == contraBank;
    //     })[0];
    //     var restBankDetails = data.banks.filter((bank) => {
    //       return bank.bankName != contraBank && bank.bankName != controlBank;
    //     });

    //     controlBankBalance = parseInt(filteredControlBank.accounts[0].balance);
    //     contraBankBalance = parseInt(filteredContraBank.accounts[0].balance);
    //     contraBankMinBalance = parseInt(filteredContraBank.accounts[0].minBalance);
    //     if (controlBankBalance > target) {
    //       contraBankBalance += controlBankBalance - target;
    //       controlBankBalance = target;
    //     }
    //     if (controlBankBalance < target) {
    //       if ((contraBankBalance - target - contraBankBalance) > contraBankMinBalance) {
    //         contraBankBalance -= target - contraBankBalance;
    //         controlBankBalance = target;
    //       } else {
    //         result.push({
    //           "priority": priorityId,
    //           "message": "Transaction failed,ContraBank minimun balanace cannot be achieved"
    //         });
    //         return;

    //       }
    //     }

    //     filteredControlBank.accounts[0].balance = controlBankBalance;
    //     filteredContraBank.accounts[0].balance = contraBankBalance;
    //     data.banks = [...restBankDetails, filteredControlBank, filteredContraBank];
    //     //update the transaction  
    //     request.patch({
    //       url: serviceUrlConfig.dbUrl + '/' + userName + '-commercial',
    //       body: {
    //         'banks': data.banks
    //       },
    //       json: true
    //     }, function (err, response, body) {
    //       if (err) return res.status(500).json({
    //         message: 'Failed to patch data'
    //       })
    //       console.log(body);
    //       result.push({
    //         "priority": priorityId,
    //         "message": "transaction successful"
    //       });
    //       //res.status(200).json(body);
    //     });
      // });
    // }
  });
  // res.json({
  //   result
  // });
  next();
});

module.exports = router;


// request.get(serviceUrlConfig.dbUrl+'/'+userName+'-instructions', function (err, response, body) {
//   if (err) return res.status(500).json({
//     message: 'Failed to load data'
//   })
//   // console.log(body, postData.transfers);
//   var instrObj = JSON.parse(body);
//   var len = Object.keys(instrObj).length;
//   if(len===0) {
//     res.send("Empty for now");
//   }

//       for (i = 0; i < len; i++) {
//         if (instrObj[userName].instructions[i].instrId > max)
//           max = instrObj[userName].instructions[i].instrId;

//         if (instrObj[userName].instructions[i].priorityId > prior)
//           prior = instrObj[userName].instructions[i].instrId;
//       }

//       var result={
//         instrId: max + 1,
//         controlBank,
//         cntrlBnkAccId,
//         contraBank,
//         cntraBnkAccId,
//         target,
//         priorityId: prior + 1
//       };


//       request.patch({
//         url: serviceUrlConfig.dbUrl + '/' + userName + '-commercial',
//         body: {
//           'banks': data.banks
//         },
//         json: true
//       }, function (err, response, body) {
//         if (err) return res.status(500).json({
//           message: 'Failed to patch data'
//         })
//         console.log(body);
//         result.push({
//           "priority": priorityId,
//           "message": "transaction successful"
//         });
//         //res.status(200).json(body);
//       });

//     }  
// /*
//     let instrObj = require('../data/instructions.json');
//     if(Object.keys(instrObj).length===0) {
//       res.send("Empty for now");
//     }

//     let len = instrObj[userName].instructions.length;
//     let max = 0,
//       prior = 0;

//     //to get last value of ID	
//     for (i = 0; i < len; i++) {
//       if (instrObj[userName].instructions[i].instrId > max)
//         max = instrObj[userName].instructions[i].instrId;

//       if (instrObj[userName].instructions[i].priorityId > prior)
//         prior = instrObj[userName].instructions[i].instrId;
//     }

//     //pushing the request body data to the array
//     instrObj[userName].instructions.push({
//       instrId: max + 1,
//       controlBank,
//       contraBank,
//       target,
//       priorityId: prior + 1
//     });

//     instrObj[userName].instructions.sort((a, b) => (a.priorityId > b.priorityId) ? 1 : ((b.priorityId > a.priorityId) ? -1 : 0))
//     //writing the file synchronously
//     try {
//       fs.writeFileSync(__dirname + "/../data/instructions.json", JSON.stringify(instrObj, null, 2) );
//     } catch (err) {
//       if (err) {
//         throw err;
//       }
//     }
//     //console.log(obj);
//     res.send(instrObj[userName]);
//   */