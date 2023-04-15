const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cookieValidator = require('../../authorization/cookie-validator');
const getGameboard = require('../../route-handlers/get-gameboard');
const createGameboard = require('../../route-handlers/create-gameboard');
const setGameboard = require('../../route-handlers/set-gameboard.js');
const deleteGameboard = require('../../route-handlers/delete-gameboard');
const { auth } = require('express-oauth2-jwt-bearer');
const decodeJsonBody = require('../../authorization/decode-auth-params');
const checkPresenter = require('../../authorization/check-presenter');
const cookieSetter = require('../../authorization/new-cookie-setter');

// maintain strictQuery behavior in Mongoose 7 (https://mongoosejs.com/docs/guide.html#strictQuery)
mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_CONN_STRING);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected.');
});

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASEURL,
});

router.get(
  '/authorize/:payload',
  checkJwt,
  decodeJsonBody,
  checkPresenter,
  cookieSetter,
  (req, res, next) => {
    res.status(200).json({ message: 'Authorized.' });
  }
);

router.get('/words/:category', cookieValidator, async (req, res) => {
  console.log('GET words/:category params.id', req.params.category);
  const category = req.params.category;

  if (category.length === 0) {
    res.status(400).json({ message: 'Missing category' });
  } else {
    const getWords = require('../../route-handlers/get-words');
    const cat = category.trim();
    const wordList = await getWords(req.cookies['useruuid'], cat);
    res.status(200).json({ words: wordList });
  }
});

router.post('/word', cookieValidator, async (req, res, next) => {
  const { category, word } = req.body;
  console.log('POST word body', category, word);

  if (!category || !word) {
    res.status(400).json({ message: 'Missing body' });
  }
  res.locals.word = word;
  res.locals.category = category;
  res.locals.newWord = word;
  const addWord = require('../../route-handlers/updadd-word');
  await addWord(req, res, next);
  res
    .status(res.locals.statusCode)
    .json({ 'New word': `${res.locals.newWord}` });
});

router.post('/words', cookieValidator, async (req, res, next) => {
  const { category, words } = req.body;
  console.log('POST words category, words:', category, words);
  const addBulkWords = require('../../route-handlers/add-bulk-words');
  addBulkWords(req, res, next)
    .then((results) => {
      console.log('insertMany results count:', results.length);
      res.status(201).json({ 'bulk insert': 'succeeded' });
    })
    .catch((err) => {
      console.log('insertMany error:', err);
      res.locals.statusCode = 400;
      next(err);
    });
});

// const checkScopes = requiredScopes('read:categories');

// router.get(
//   '/categories',
//   auth,
//   checkScopes,
//   cookieValidator,
//   function (req, res) {
//     res.json(['authorized', 'categories', 'route', 'access', 'permitted!']);
//   }
// );
router.get('/categories', cookieValidator, async (req, res, next) => {
  const getCategories = require('../../route-handlers/get-categories');
  const result = await getCategories(req, res, next);
  console.log(
    'categories: getCategories returned result, result.length',
    result,
    result.length
  );
  const resultMsg = result;
  const statusCode = (result.length > 0 && 200) || 404;
  res.status(statusCode).json(resultMsg);
});

router.patch('/word', cookieValidator, async (req, res, next) => {
  const { category, word, newWord } = req.body;
  console.log('PATCH Word for user: word, new word =>', word, newWord);

  if (!category || !word || !newWord) {
    res.status(400).json({ message: 'Missing body' });
  } else {
    res.locals.word = word;
    res.locals.category = category;
    res.locals.newWord = newWord;
    const addWord = require('../../route-handlers/updadd-word');
    await addWord(req, res, next);
    res
      .status(res.locals.statusCode)
      .json({ 'New word': `${res.locals.newWord}` });
  }
});

router.delete('/word', cookieValidator, async (req, res, next) => {
  const { category, word } = req.body;

  if (!category || !word) {
    res.status(400).json({ message: 'Missing body' });
  } else {
    res.locals.category = category;
    res.locals.word = word;
    const removeWord = require('../../route-handlers/remove-word');
    removeWord(req, res, next)
      .then(() =>
        res
          .status(res.locals.statusCode)
          .json({ message: `${res.locals.resultMsg}` })
      )
      .catch((error) => {
        console.log('delete word route catch error:', error);
        res.status(400).json({ message: 'Unable to delete word.' });
      });
  }
});

router.get('/gameboard/:id', getGameboard, async (req, res) => {
  const statusCode = res.locals.statusCode;
  const resultMsg = res.locals.resultMsg;
  res.status(statusCode).json(resultMsg);
});

router.post(
  '/gameboard',
  cookieValidator,
  createGameboard,
  setGameboard,
  async (req, res) => {
    const statusCode = res.locals.statusCode;
    const resultMsg = res.locals.resultMsg;
    res.status(statusCode).json({ gameboardUri: resultMsg });
  }
);

router.delete(
  '/gameboard',
  cookieValidator,
  deleteGameboard,
  async (req, res) => {
    const statusCode = res.locals.statusCode;
    const resultMsg = res.locals.resultMsg;
    res.status(statusCode).json({ message: resultMsg });
  }
);

module.exports = router;
