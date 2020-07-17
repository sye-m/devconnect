const express = require('express');
const config = require('config');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = config.get('jwtSecret');
const User = require('../../models/User');
const gravatar = require('gravatar');
const router = express.Router();

// @POST api/users
// @desc register users
// Not protected
router.post('/', [
    check('name', 'Name is Required').not().isEmpty(),
    check('email', 'Email is invalid').isEmail(),
    check('password', 'Password should be minimum 8 characters').isLength({ min: 8 })
], async(req, res) => {
    const errors = validationResult(req);
    let { name, email, password } = req.body;
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User is already registered' }] });
        }

        console.log(req);
        const avatar = gravatar.url(email, {
            r: 'pg',
            s: '200',
            d: 'mm'
        });
        user = new User({
            name,
            email,
            avatar,
            password
        });

        //encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword
        await user.save();
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, jwtSecret, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        })

    } catch (err) {
        console.log(err);
        console.log("Server error");
        res.status(500).send('Server error');
    }
});

router.post('/login', [
    check('email', 'Email is invalid').isEmail(),
    check('password', 'Password is required').not().isEmpty()
], async(req, res) => {
    const errors = validationResult(req);
    let { email, password } = req.body;
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email });
        //check if user exists
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }

        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }
        const payload = {
            user: {
                id: user.id
            }
        }

        //get token if user is logged in
        jwt.sign(payload, jwtSecret, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        })

    } catch (err) {
        console.log(err);
        console.log("Server error");
        res.status(500).send('Server error');
    }
});

module.exports = router;