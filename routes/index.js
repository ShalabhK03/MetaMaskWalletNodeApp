var express = require('express');
var router = express.Router();
var web3 = require('web3');
const web = new web3('https://ropsten.infura.io/v3/f0a515a09eec47e693c59d03e1bfd1de');
var abi = require('ethereumjs-abi');
var Tx = require('ethereumjs-tx').Transaction;
var mongodb = require('../database');
let AccountModel = require('../models/account');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/createWallet', (req, res) => {
  let result = web.eth.accounts.create(web.utils.randomHex(32));
  let account = new AccountModel({
    address: result.address,  
    privateKey: result.privateKey,
    name: req.body.name,
    isActive: true,
    mobileNumber: req.body.mobileNumber
  });
  account.save().then((result) => {
    res.status(200).send(result);
  });
});

router.post('/getWalletBalance', (req,res) => {
  web.eth.getBalance(req.body.address).then((result) => {
    console.log(web.utils.fromWei(result, 'ether'));
    res.status(200).send(web.utils.fromWei(result, 'ether'));
  });  
});

router.post('/sendEther', (req, res) => {
  // Fetch the private key from DB
  AccountModel.find({"address": req.body.fromAddress}).then((account) => {
    
    // fetches the transaction count for the senders account, just to calculate nonce
    web.eth.getTransactionCount(req.body.fromAddress).then((count) => {

    // creating the transaction data
    var txData = {
      to: req.body.toAddress,
      value: web.utils.toHex(web.utils.toWei(req.body.amount, 'ether')),
      nonce: count,
      gasLimit: web.utils.toHex(21000),
      gasPrice: web.utils.toHex(web.utils.toWei('10', 'gwei'))
    }
    console.log('here');
    // signing the transaction using ropsten chain network
    var tx = new Tx(txData, {'chain':'ropsten'});
    tx.sign(Buffer.from(account[0].privateKey.split('0x')[1], 'hex'));

    var txSerialized = tx.serialize();
    var raw = "0x" + txSerialized.toString('hex');
    
    // sending the signed transaction
    web.eth.sendSignedTransaction(raw)
      .on('receipt', (receipt) => { 
        console.log("receipt send ether: ", receipt); 
        res.status(200).send(JSON.stringify(receipt)).resolve();
      })
      .on('error', (error) => { console.log("error send ether: ", error); })
  }).catch((err) => console.log(err.message));
  });
});

router.post('/signMessage', (req, res) => {
  var hash = "0x" + abi.soliditySHA3(["address", "uint256", "uint256", "address"], 
                      [req.body.recipientAddress, req.body.amount, req.body.nonce, req.body.contractAddress]
                      ).toString("hex");
  
  console.log(hash);
  web.eth.personal.sign(hash, req.body.senderAddress).then(console.log);
});

router.get('/accountList', (req,res) => {
  AccountModel.find({}).then(doc => {
    res.status(200).send(doc);
  }).catch(err => {
    res.send(err);
  })
});

module.exports = router;
