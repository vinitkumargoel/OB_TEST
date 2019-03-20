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
  let instruction = req.body
  console.log(instruction)
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
          instructionId: parseInt(data['currentInstructions'].length) + 100000,
          priorityId: parseInt(data['currentInstructions'].length) + 1,
          controlBankAccountNumber: instruction.controlBankAccountNumber,
          controlBusinessName:instruction.controlBusinessName,
          contraBankAccountNumber: instruction.contraBankAccountNumber,
          contraBusinessName: instruction.contraBusinessName,
          target: instruction.target,
         	instructionType:"Target Balance",
					executionMode:"Manual",
				  reversal:"false",
				  forceDebitControlAccount:"false",
				  forceDebitContraAccount:"false"
        }
        let finalData = data['currentInstructions'];
        finalData.push(resObj);
        request.post({
          url: serviceUrlConfig.dbUrl+'/'+userName+'-instructions',
          body: {
            'currentInstructions': finalData
          },
          json: true
        }, function(err, response, body){
          if(err) return res.status(500).json({ message: 'Failed to patch data'})
          res.status(200).json(body);
        })
      });
  });
});

router.post('/transaction', function (req, res, next) {
  let token = req.headers['x-access-token'];
  let accNoList = req.body.accountList;

  jwt.verify(token, config.secret, function (err, decodedObj) {
     if (err) return res.status(500).json({
       auth: false,
     message: 'Failed to authenticate token.'
     });
    let userName = decodedObj.username;
   // console.log(userName);
    let result= instrResult(userName,accNoList);
  
    
    result.then(function(data) {
      if(data == accNoList.length)
        res.send({"success":"true"});
      else
        res.send({"success":"false"});
      console.log(data) ;
      // res.send(data);
   })
   .catch((err)=>{
    console.log(err);
   })
   
      
  });
  
});


const instrResult=async(userName,accNoList)=>{
  let instrObj=await getInstruction(userName);
  // console.log(instrObj);


 // let len = instrObj["currentInstructions"].length;
  let result = 0;
 // let allInstructionIDs = [];
  instrObj = instrObj["currentInstructions"];
  let instructionsToExecute = [];

  for(i in instrObj) {
    for(j in instrObj[i]) {
      if(j==="instructionId" && accNoList.includes(JSON.stringify(instrObj[i][j]))) {
        instructionsToExecute.push(instrObj[i]);
      }
    }
  }
   
    //console.log(instructionsToExecute);
    let len2= instructionsToExecute.length;
    let controlBankAccountNumber, contraBankAccountNumber, target, controlBankBalance, contraBankBalance, contraBankMinBalance;
    let controlBankBeforeBalance, contraBankBeforeBalance, history, poolingAmount;

    //to get last value of ID	
    for (i = 0; i < len2; i++) {
      controlBusinessName = instructionsToExecute[i].controlBusinessName;
      console.log(controlBusinessName);
      contraBusinessName = instructionsToExecute[i].contraBusinessName;
      controlBankAccountNumber= instructionsToExecute[i].controlBankAccountNumber;
      contraBankAccountNumber= instructionsToExecute[i].contraBankAccountNumber;
      target = parseInt(instructionsToExecute[i].target);
      priorityId = parseInt(instructionsToExecute[i].priorityId);
      instructionId = parseInt(instructionsToExecute[i].instructionId);
      // console.log(target);
      // console.log(typeof target);
      let data=await getcommercialAcct(userName)      
     
        //console.log(data);
        var filteredControlBusiness = data.business.filter((businesses) => {
           return businesses.name == controlBusinessName;
        })[0];

        //console.log(filteredControlBusiness);

        var filteredContraBusiness = data.business.filter((businesses) => {
           return businesses.name == contraBusinessName;
        })[0];
        var restBusinessDetails = data.business.filter((businesses) => {
           return businesses.name != contraBusinessName && businesses.name != controlBusinessName;
        });

        var filteredControlAcc=filteredControlBusiness["accounts"].filter((acc)=>{
          return acc.accountNumber == controlBankAccountNumber;
        });

        var filteredContraAcc=filteredContraBusiness["accounts"].filter((acc)=>{
          return acc.accountNumber == contraBankAccountNumber;
        });

        
        // console.log(filteredControlBank);
        //console.log(filteredControlAcc);
        // console.log(filteredContraAcc[0].balance);
        
        controlBankBalance = parseInt(filteredControlAcc[0].availableBalance);
        contraBankBalance = parseInt(filteredContraAcc[0].availableBalance);
        contraBankMinBalance = parseInt(filteredContraAcc[0].minimumBalance);

        console.log(controlBankBalance,contraBankBalance,contraBankMinBalance);
        console.log(typeof controlBankBalance);

        if(controlBankBalance === target){
          history = await getHistory(userName);
          history.push({
            "executionId": history.length + 1000,
            "instructionId": instructionId,
            "controlAccount":{
              "controlAccountNumber": controlBankAccountNumber,
              "balanceBeforeExecution": controlBankBalance,
              "balanceAfterExecution": controlBankBalance
            },
            "contraAccount":{
              "contraAccountNumber": contraBankAccountNumber,
              "balanceBeforeExecution": contraBankBalance,
              "balanceAfterExecution": contraBankBalance
            },
            "executionDateTime": new Date(),
             "status": 'success', // or fail
             "failureReason": "nill",
             "target": target,
             "poolingAmmount": '0',
             "instructionType": "Target Balance",
             "priorityId": priorityId,
             "executionMode": "Manual",
             "reversal": "false",
             "forceDebitControlAccount": "false",
             "forceDebitContraAccount": "false",
             "message": "Target Balance is same as in the account"
          });
          let result2= await updateHistory(userName,history);
          if(result2){
            result++;
          }
        }
        //console.log(result);
        if (controlBankBalance > target) {
          contraBankBeforeBalance = contraBankBalance;
          controlBankBeforeBalance = controlBankBalance;
          contraBankBalance += controlBankBalance - target;
          controlBankBalance = target;
          //console.log(controlBankBalance,contraBankBalance);

            filteredControlAcc[0].availableBalance = controlBankBalance;
            filteredContraAcc[0].availableBalance = contraBankBalance;
            poolingAmount = controlBankBeforeBalance - target;
            if(controlBusinessName == contraBusinessName)
              data.business = [...restBusinessDetails, filteredControlBusiness];
            else
              data.business = [...restBusinessDetails, filteredControlBusiness, filteredContraBusiness];
        //update the transaction  

            let newResult=await updateTransaction(userName,data.business,priorityId,controlBankBalance,contraBankBalance);
            if(newResult){
              history = await getHistory(userName);
          history.push({
            "executionId": history.length + 1000,
            "instructionId": instructionId,
            "controlAccount":{
              "controlAccountNumber": controlBankAccountNumber,
              "balanceBeforeExecution": controlBankBeforeBalance,
              "balanceAfterExecution": controlBankBalance
            },
            "contraAccount":{
              "contraAccountNumber": contraBankAccountNumber,
              "balanceBeforeExecution": contraBankBeforeBalance,
              "balanceAfterExecution": contraBankBalance
            },
            "executionDateTime": new Date(),
             "status": 'success', // or fail
             "failureReason": "nill",
             "target": target,
             "poolingAmount": poolingAmount,
             "instructionType": "Target Balance",
             "priorityId": priorityId,
             "executionMode": "Manual",
             "reversal": "false",
             "forceDebitControlAccount": "false",
             "forceDebitContraAccount": "false",
             "message": "Transaction successfull"
          });
          let result2= await updateHistory(userName,history);
          if(result2){
            result++;
          } 
            }
            
        }
        else if(controlBankBalance < target) {
          if((target - controlBankBalance)>contraBankBalance){
            history = await getHistory(userName);
            history.push({
              "executionId": history.length + 1000,
              "instructionId": instructionId,
              "controlAccount":{
                "controlAccountNumber": controlBankAccountNumber,
                "balanceBeforeExecution": controlBankBalance,
                "balanceAfterExecution": controlBankBalance
              },
              "contraAccount":{
                "contraAccountNumber": contraBankAccountNumber,
                "balanceBeforeExecution": contraBankBalance,
                "balanceAfterExecution": contraBankBalance
              },
              "executionDateTime": new Date(),
               "status": 'fail',
               "failureReason": "As insufficient contra account balance",
               "target": target,
               "poolingAmmount": '0',
               "instructionType": "Target Balance",
               "priorityId": priorityId,
               "executionMode": "Manual",
               "reversal": "false",
               "forceDebitControlAccount": "false",
               "forceDebitContraAccount": "false",
               "message": "Insufficient funds in the account"             
           });
           let result2= await updateHistory(userName,history);
           if(result2){
            //result++;
          } 
          }
           else if ((contraBankBalance - (target - controlBankBalance)) >= contraBankMinBalance) {
             controlBankBeforeBalance = controlBankBalance;
             contraBankBeforeBalance = contraBankBalance;
             contraBankBalance = contraBankBalance-target+controlBankBalance;
             controlBankBalance = target;

             //console.log(contraBankBalance+"dsffsf");
              //console.log(contraBankBalance,controlBankBalance);

             // console.log(filteredControlAcc);

             filteredControlAcc[0].availableBalance = controlBankBalance;
             filteredContraAcc[0].availableBalance = contraBankBalance;
             if(controlBusinessName == contraBusinessName)
              data.business = [...restBusinessDetails, filteredControlBusiness];
             else
              data.business = [...restBusinessDetails, filteredControlBusiness, filteredContraBusiness];
            //update the transaction  
            let newResult2=await updateTransaction(userName,data.business,priorityId,controlBankBalance,contraBankBalance);
              if(newResult2){
                history = await getHistory(userName);
                history.push({
                  "executionId": history.length + 1000,
                  "instructionId": instructionId,
                  "controlAccount":{
                    "controlAccountNumber": controlBankAccountNumber,
                    "balanceBeforeExecution": controlBankBeforeBalance,
                    "balanceAfterExecution": controlBankBalance
                  },
                  "contraAccount":{
                    "contraAccountNumber": contraBankAccountNumber,
                    "balanceBeforeExecution": contraBankBeforeBalance,
                    "balanceAfterExecution": contraBankBalance
                  },
                  "executionDateTime": new Date(),
                   "status": 'success', // or fail
                   "failureReason": "nill",
                   "target": target,
                   "poolingAmmount": target - controlBankBeforeBalance,
                   "instructionType": "Target Balance",
                   "priorityId": priorityId,
                   "executionMode": "Manual",
                   "reversal": "false",
                   "forceDebitControlAccount": "false",
                   "forceDebitContraAccount": "false",
                   "message": "Transaction successfull"
                });
                let result2= await updateHistory(userName,history);
                if(result2){
                  result++;
                } 
              }    
            }else {
              history = await getHistory(userName);
              history.push({
              "executionId": history.length + 1000,
              "instructionId": instructionId,
              "controlAccount":{
                "controlAccountNumber": controlBankAccountNumber,
                "balanceBeforeExecution": controlBankBalance,
                "balanceAfterExecution": controlBankBalance
              },
              "contraAccount":{
                "contraAccountNumber": contraBankAccountNumber,
                "balanceBeforeExecution": contraBankBalance,
                "balanceAfterExecution": contraBankBalance
              },
              "executionDateTime": new Date(),
               "status": 'fail',
               "failureReason": "As insufficient contra account minimum balance",
               "target": target,
               "poolingAmmount": '0',
               "instructionType": "Target Balance",
               "priorityId": priorityId,
               "executionMode": "Manual",
               "reversal": "false",
               "forceDebitControlAccount": "false",
               "forceDebitContraAccount": "false", 
               "message": "Transaction failed,ContraBank minimun balanace cannot be achieved"
              
            });
            let result2= await updateHistory(userName,history);
            if(result2){
             // result++;
            } 
          
        }
      }

        
     };
    //  console.log(result);
    //  console.log(typeof result);
     return result;
   };
   
   router.get('/history', function (req, res, next) {
    let token = req.headers['x-access-token'];
    
  
    jwt.verify(token, config.secret, function (err, decodedObj) {
       if (err) return res.status(500).json({
         auth: false,
       message: 'Failed to authenticate token.'
       });
      let userName = decodedObj.username;
     // console.log(userName);
      let result= getHistory(userName);
    
      
      result.then(function(data) {
        
        res.send(data);
     })
     .catch((err)=>{
      console.log(err);
     })
     
        
    });
    
  });

  router.get('/accounts', function (req, res, next) {
    let token = req.headers['x-access-token'];
    
  
    jwt.verify(token, config.secret, function (err, decodedObj) {
       if (err) return res.status(500).json({
         auth: false,
       message: 'Failed to authenticate token.'
       });
      let userName = decodedObj.username;
     // console.log(userName);
      let result= getcommercialAcct(userName);
    
      
      result.then(function(data) {
        
        res.send(data);
     })
     .catch((err)=>{
      console.log(err);
     })
     
        
    });
    
  });


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

let getHistory=async(userName)=>{
  try{
    let historyObj=await axios.get(`${serviceUrlConfig.dbUrl}/${userName}-history`)
    return historyObj.data["history"];
  }catch(err) {
    console.log(err); 
  };  
}

let updateTransaction=async(userName,business,priorityId,controlBankBalance,contraBankBalance)=>{
  //let newObj={};
  try{
  let resp=await axios.patch(serviceUrlConfig.dbUrl + '/' + userName + '-commercial',{'business': business})
  if(resp){
   // console.log(resp.data);
   return true;
  };
  
  
  }catch(err){  
    throw new Error('Failed to patch data');
  };
  
};

let updateHistory=async(userName,historyList)=>{
  let newObj={};
  try{
  let resp=await axios.patch(serviceUrlConfig.dbUrl + '/' + userName + '-history',{'history': historyList})
  if(resp){
   // console.log(resp.data);
    return true;
  };
  
  // return newObj;
  }catch(err){  
    throw new Error('Failed to patch data');
  };
  
};

router.get('/getInstruction',(req,res)=>{
  let token = req.headers['x-access-token'];
  

  jwt.verify(token, config.secret, function (err, decodedObj) {
     if (err) return res.status(500).json({
       auth: false,
     message: 'Failed to authenticate token.'
     });

     let userName = decodedObj.username;
   // console.log(userName);
    let result= getInstruction(userName);
  
    
    result.then(function(data) {
     // console.log(data) ;
      res.send(data);
   })
   .catch((err)=>{
    console.log(err);
   })

    });
});




router.get('/balances',(req,res)=>{
  let token = req.headers['x-access-token'];
  

  jwt.verify(token, config.secret, function (err, decodedObj) {
     if (err) return res.status(500).json({
       auth: false,
     message: 'Failed to authenticate token.'
     });

     let userName = decodedObj.username;
   // console.log(userName);
     getInstruction(userName).then(function(instrObj) {
       
        // console.log(instrObj);
      
           let len = instrObj["currentInstructions"].length;
           let result = [];
        let i=0;
           
          let controlBank, contraBank, controlBankAccountNumber, contraBankAccountNumber, target, controlBankBalance, contraBankBalance, contraBankMinBalance;
      
          //to get last value of ID	
          //for (i = 0; i < len; i++) {
            controlBank = instrObj["currentInstructions"][i].controlBank;
            contraBank = instrObj["currentInstructions"][i].contraBank;
            controlBankAccountNumber= instrObj["currentInstructions"][i].controlBankAccountNumber;
            contraBankAccountNumber= instrObj["currentInstructions"][i].contraBankAccountNumber;
            target = parseInt(instrObj["currentInstructions"][i].target);
            priorityID = parseInt(instrObj["currentInstructions"][i].priorityID);
            //console.log(target);
      
            getcommercialAcct(userName).then(function(data) {
                 // console.log(data) ;
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
     
               res.send({controlBankBalance,contraBankBalance,contraBankMinBalance});
          

               })
               .catch((err)=>{
                console.log(err);
               });      
           
              //console.log(data);
             
      //   result.then(function(data) {
      //    // console.log(data) ;
      //     res.send(data);
      //  })
      //  .catch((err)=>{
      //   console.log(err);
      //  })
    
        //};   
          // return(result);
       })
       .catch((err)=>{
        console.log(err);
      });
   });
});


module.exports = router;


