const express = require('express');

const user = require('../../controllers/user');

const router = express.Router();

router.post('/users', user.createUser);

module.exports = router;
