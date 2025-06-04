const express = require('express');
const router = express.Router();
const { handleUser } = require('../controllers/registerControl')

router.post("/", handleUser)

module.exports = router;