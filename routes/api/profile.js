const express = require('express');
const router = express.Router();

// @GET api/users
// @desc get users
// Not protected
router.get('/', (req, res) => res.send('profile route'));

module.exports = router;