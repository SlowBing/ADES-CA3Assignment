const express = require('express');
const cors = require('cors');
const { nanoid, customAlphabet } = require('nanoid');
const BClicker = require('./BClicker');
const createHttpError = require('http-errors');

const app = express();
app.use(cors());
app.use(express.json());

// Create a GET route
app.get('/', (req, res, next) => {
  res.status(200).json({
    Hello: "This is BClicker app's backend, install the app in the apk folder to access the game",
    APIs: {
      'Create User': {
        description: 'Creates a new UID upon launch of game.',
        method: 'POST',
        path: '/user',
      },
      'Get User Info': {
        description: 'Get user information.',
        method: 'GET',
        path: '/userInfo',
      },
      'Update User Point': {
        description: 'Get user information.',
        method: 'PUT',
        path: '/point',
      },
    },
  });
});

// Init
app.post('/init', function (req, res, next) {
  return BClicker.init()
    .then(function () {
      return res.sendStatus(200);
    })
    .catch(next);
});

// Create user_id 
app.post('/user', (req, res, next) => {
  const nanoid = customAlphabet('1234567890', 10);
  const userId = nanoid();
  const point = 0;

  return BClicker.createUser(userId, point)
    .then(function () {
      // console.log(200, { userId: userId, point: point });
      return res.status(200).send({ userId: userId, point: point });
    })
    .catch(next);
});

// Get user info
app.get('/userInfo', (req, res, next) => {
  const userId = req.query.userId;

  return BClicker.getUserInfo(userId)
    .then(function (info) {
      const jsonObject = Object.assign({}, info);
      jsonObject['userId'] = jsonObject['0'];
      jsonObject['point'] = jsonObject['1'];
      delete jsonObject['1'];
      delete jsonObject['0'];
      return res.json(jsonObject);
    })
    .catch(next);
})

// Update user point
app.put('/point', (req, res, next) => {
  const userId = req.query.userId;
  const point = req.query.point;

  return BClicker.updateUserPoint(point, userId)
    .then(function (info) {
      return res.json(info);
    })
    .catch(next);
})

// Error handler
app.use((req, res, next) => next(createHttpError(404, `Unknown resource ${req.method} ${req.originalUrl}`)));

app.use(function (err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Unknown Error!';
  return res.status(status).json({
    error: message,
  });
});

// This displays message that the server running and listening to specified port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App is listening on port ${port}`));
