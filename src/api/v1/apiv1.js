const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
  res.status(501).json({ message: 'api/v1/ not implemented.' });
});

router.get('/login', (req,res)=>{
  res.status(501).json({ message: 'Unable to authorize at this time.'});
});

module.exports = router;
