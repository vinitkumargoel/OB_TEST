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




router.get('/getInstruction',(req,res)=> {
  var token = req.headers['x-access-token'];

    jwt.verify(token, config.secret, function (err, decodedObj) {        
        if (err) {
            return res.status(401).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });
        };
        let userName = decodedObj.username;

        request
            .get(`${serviceUrlConfig.dbUrl}/${userName}-instructions`, (err, response, body) => {
                if(err) {
                    res.status(500).json({
                        errorMsg: 'User data not available'
                    });
                }
                //let instructionSet = JSON.parse(body);
                res.status(200).json(body);
            });
    });
})

router.get('/transaction', function (req, res, next) {
  let token = req.headers['x-access-token'];
  

  jwt.verify(token, config.secret, function (err, decodedObj) {
     if (err) return res.status(500).json({
       auth: false,
     message: 'Failed to authenticate token.'
     });
    let userName = decodedObj.username;
   // console.log(userName);
    let result= instrResult(userName);
  
    
    result.then(function(data) {
     // console.log(data) ;
      res.send(data);
   })
   .catch((err)=>{
    console.log(err);
   })
   
      
  });
  
});


const instrResult=async(userName)=>{
  let instrObj=await getInstruction(userName);
  // console.log(instrObj);

     let len = instrObj["instruction-list"].length;
     let result = [];

     
    let controlBank, contraBank, controlBankAccountNumber, contraBankAccountNumber, target, controlBankBalance, contraBankBalance, contraBankMinBalance;

    //to get last value of ID	
    for (i = 0; i < len; i++) {
      controlBank = instrObj["instruction-list"][i].controlBank;
      contraBank = instrObj["instruction-list"][i].contraBank;
      controlBankAccountNumber= instrObj["instruction-list"][i].controlBankAccountNumber;
      contraBankAccountNumber= instrObj["instruction-list"][i].contraBankAccountNumber;
      target = parseInt(instrObj["instruction-list"][i].target);
      priorityID = parseInt(instrObj["instruction-list"][i].priorityID);
      //console.log(target);

      let data=await getcommercialAcct(userName)      
     
        //console.log(data);
        var filteredControlBank = data.banks.filter((bank) => {
           return bank.bankName == controlBank;
        })[0];

        //console.log(filteredControlBank);

        var filteredContraBank = data.banks.filter((bank) => {
           return bank.bankName == contraBank;
        })[0];
        var restBankDetails = data.banks.filter((bank) => {
           return bank.bankName != contraBank && bank.bankName != controlBank;
        });

        var filteredControlAcc=filteredControlBank["accounts"].filter((acc)=>{
          return acc.accountNumber == controlBankAccountNumber;
        });

        var filteredContraAcc=filteredContraBank["accounts"].filter((acc)=>{
          return acc.accountNumber == contraBankAccountNumber;
        });

        
        // console.log(filteredControlBank);
        //console.log(filteredControlAcc);
        // console.log(filteredContraAcc[0].balance);
        
        controlBankBalance = filteredControlAcc[0].balance;
        contraBankBalance = filteredContraAcc[0].balance;
        contraBankMinBalance = filteredContraAcc[0].minBalance;

        //console.log(controlBankBalance,contraBankBalance,contraBankMinBalance);
        
        if(controlBankBalance == target){
          result.push({
            "priority": priorityID,
            "message": "Control Bank balance is same as target",
            "controlBankBalance": controlBankBalance,
            "contraBankBalance": contraBankBalance
          });
        }
        //console.log(result);
        if (controlBankBalance > target) {
           contraBankBalance += controlBankBalance - target;
          controlBankBalance = target;
          //console.log(controlBankBalance,contraBankBalance);

            filteredControlAcc[0].balance = controlBankBalance;
            filteredContraAcc[0].balance = contraBankBalance;
            data.banks = [...restBankDetails, filteredControlBank, filteredContraBank];
        //update the transaction  

            let newResult=updateTransaction(userName,data.banks,priorityID,controlBankBalance,contraBankBalance);
            if(newResult){
              result.push(newResult);
            }
            
        }
        else if(controlBankBalance < target) {
           if ((contraBankBalance - target - contraBankBalance) > contraBankMinBalance) {
             contraBankBalance -= target - contraBankBalance;
             controlBankBalance = target;
              //console.log(contraBankBalance,controlBankBalance);

             filteredControlBank["accounts"][0].balance = controlBankBalance;
             filteredContraBank["accounts"][0].balance = contraBankBalance;
             data.banks = [...restBankDetails, filteredControlBank, filteredContraBank];
            //update the transaction  
            let newResult2=updateTransaction(userName,data.banks,priorityID,controlBankBalance,contraBankBalance);
              if(newResult2){
                result.push(newResult2);
              }    
            }else {
             result.push({
               "priority": priorityID,
              "message": "Transaction failed,ContraBank minimun balanace cannot be achieved"
            });
          
        }
      }

        
     };

     return result;
   };
   


let getInstruction=async(userName)=>{
  try{
    let instrObj=await axios.get(`${serviceUrlConfig.dbUrl}/${userName}-instructions`)
    return instrObj.data;
  }catch(err) {
    console.log(err); 
  };  
}

let getcommercialAcct=async(userName)=>{
  try{
  let com=await axios.get(serviceUrlConfig.dbUrl + '/' + userName + '-commercial')
  return com.data; 
  }catch(err){
      throw new Error('Failed to load data');
   };
};

let updateTransaction=async(userName,bank,priorityID,controlBankBalance,contraBankBalance)=>{
  let newObj={};
  try{
  let resp=await axios.patch(serviceUrlConfig.dbUrl + '/' + userName + '-commercial',{'banks': bank})
  if(resp){
   // console.log(response);
    
  };
  newObj={
    "priority": priorityID,
    "message": "transaction successful",
    "controlBankBalance": controlBankBalance,
    "contraBankBalance": contraBankBalance
  };
  return newObj;
  }catch(err){  
    throw new Error('Failed to patch data');
  };
  
};


module.exports = router;
