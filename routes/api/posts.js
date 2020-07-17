const express = require('express');
const router = express.Router();

// @GET api/users
// @desc get users
// Not protected
router.get('/', (req, res) => res.send('post route'));

module.exports = router;