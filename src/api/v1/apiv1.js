const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


mongoose mongoose.connect(process.env.MONGO_CONN_STRING);
const db = mongoose.connection;
db.on('error', console.error.bing(console, 'connection error:'));
db.once('open', function(){
  console.log('Mongoose is connected.');
});

router.get('/', (req,res)=>{
  res.status(501).json({ message: 'api/v1/ not implemented.' });
});

router.get('/login', (req,res)=>{
  res.status(501).json({ message: 'Unable to authorize at this time.'});
});

router.get('/data', (req, res)=>{
  res.status(501).json({ message: 'data call not implemented.' });
});

module.exports = router;
