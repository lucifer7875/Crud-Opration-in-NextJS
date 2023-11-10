const express = require('express');
const tokenController = require('./tokenVerifyContoller');

const router = express.Router();

// token verify route
router.post('/',tokenController.tokenVerify);

module.exports = router;
