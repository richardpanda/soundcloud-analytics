const express = require('express');

const users = require('./users');

const router = express.Router();

router.use('/api', users);

module.exports = router;
