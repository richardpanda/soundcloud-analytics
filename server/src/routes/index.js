const express = require('express');

const api = require('./api');

const router = express.Router();

router.use(api);

module.exports = router;
