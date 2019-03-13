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
  let instruction = req.body.instruction;
  
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
          instructionID: parseInt(data['currentInstructions'].length) + 1000,
          priorityID: parseInt(data['currentInstructions'].length) + 1,
          controlBankAccountNumber: instruction.controlBankAccountNumber,
          contraBankAccountNumber: instruction.contraBankAccountNumber,
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
      console.log(data) ;
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

     let len = instrObj["currentInstructions"].length;
     let result = [];

     
    let controlBank, contraBank, controlBankAccountNumber, contraBankAccountNumber, target, controlBankBalance, contraBankBalance, contraBankMinBalance;

    //to get last value of ID	
    for (i = 0; i < len; i++) {
      controlBank = instrObj["currentInstructions"][i].controlBank;
      contraBank = instrObj["currentInstructions"][i].contraBank;
      controlBankAccountNumber= instrObj["currentInstructions"][i].controlBankAccountNumber;
      contraBankAccountNumber= instrObj["currentInstructions"][i].contraBankAccountNumber;
      target = parseInt(instrObj["currentInstructions"][i].target);
      priorityID = parseInt(instrObj["currentInstructions"][i].priorityID);
      console.log(target);
      console.log(typeof target);
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

        console.log(controlBankBalance,contraBankBalance,contraBankMinBalance);
        console.log(typeof controlBankBalance);

        if(controlBankBalance === target){
          result.push({
            "priority": priorityID,
            "message": "Target Balance is same as in the account",
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

            let newResult=await updateTransaction(userName,data.banks,priorityID,controlBankBalance,contraBankBalance);
            if(newResult){
              result.push(newResult);
            }
            
        }
        else if(controlBankBalance < target) {
          if((target - controlBankBalance)>contraBankBalance){
            result.push({
              "priority": priorityID,
             "message": "Insufficient funds in the account",
             "controlBankBalance": controlBankBalance,
             "contraBankBalance": contraBankBalance
           });
          }
           else if ((contraBankBalance - (target - controlBankBalance)) >= contraBankMinBalance) {
             contraBankBalance = contraBankBalance-target+controlBankBalance;
             controlBankBalance = target;

             console.log(contraBankBalance+"dsffsf");
              //console.log(contraBankBalance,controlBankBalance);

             filteredControlBank["accounts"][0].balance = controlBankBalance;
             filteredContraBank["accounts"][0].balance = contraBankBalance;
             data.banks = [...restBankDetails, filteredControlBank, filteredContraBank];
            //update the transaction  
            let newResult2=await updateTransaction(userName,data.banks,priorityID,controlBankBalance,contraBankBalance);
              if(newResult2){
                result.push(newResult2);
              }    
            }else {
             result.push({
               "priority": priorityID,
              "message": "Transaction failed,ContraBank minimun balanace cannot be achieved",
              "controlBankBalance": controlBankBalance,
              "contraBankBalance": contraBankBalance
            });
          
        }
      }

        
     };
    //  console.log(result);
    //  console.log(typeof result);
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
   // console.log(resp.data);
    //
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