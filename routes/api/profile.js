const express = require('express');
const router = express.Router();
const config = require('config');
const request = require('request');
const authenticate = require('../../middleware/authenticate');
const Profile = require('../../models/Profile');
const { check, validationResult } = require('express-validator');

//@route GET api/profile
//@desc get user's profile
//@access protected
router.get('/', authenticate, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: 'No profile found' });
        }
        res.json(profile);
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: 'Server Error' });
    }
});

//@route GET api/profile/all
// @desc get all users profile
//@access not protected
router.get('/all', async(req, res) => {
    try {
        const profile = await Profile.find().populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: 'No profile found' });
        }
        res.json(profile);
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: 'Server Error' });
    }
});

// @route GET api/profile/user/id
// @desc get user's profile by Id
//@access public
router.get('/user/:id', async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: 'No profile found' });
        }
        res.json(profile);
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: 'Server Error' });
    }
});

// @route POST api/profile/
// @desc generate user profile
//@access protected
router.post(
    '/', [
        authenticate, [
            check('skills', 'Skills is required').not().isEmpty(),
            check('status', 'Status is required').not().isEmpty(),
        ]
    ],
    async(req, res) => {
        const errors = validationResult(req);

        // Check Validation
        if (!errors.isEmpty()) {
            // Return any errors with 400 status
            return res.status(400).json({ errors: errors.array() });
        }

        // Get fields
        const profileFields = {};
        profileFields.user = req.user.id;
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.location) profileFields.location = req.body.location;
        if (req.body.bio) profileFields.bio = req.body.bio;
        if (req.body.status) profileFields.status = req.body.status;
        if (req.body.githubusername)
            profileFields.githubusername = req.body.githubusername;

        if (req.body.skills) {
            profileFields.skills = req.body.skills.split(',').map((skill) => skill.trim());
        }
        // Social
        profileFields.social = {};
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
        try {
            let profile = await Profile.findOne({ user: req.user.id });
            if (profile) {
                // Update
                await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
                return res.json({ profile })
            }
            // Save Profile
            const newProfile = new Profile(profileFields);
            profile = newProfile.save();
            res.json({ profile })

        } catch (err) {
            console.log(err);
        }
    }
);
// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
    '/experience', [
        authenticate,
        check('title', 'Title is required').not().isEmpty(),
        check('company', 'Company name is required').not().isEmpty(),
        check('from', 'From date is required').not().isEmpty()
    ],
    (req, res) => {
        const errors = validationResult(req);

        // Check Validation
        if (!errors.isEmpty()) {
            // Return any errors with 400 status
            return res.status(400).json({ errors: errors.array() });
        }
        Profile.findOne({ user: req.user.id }).then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            };

            // Add to exp array
            profile.experience.unshift(newExp);

            profile.save().then(profile => res.json(profile));
        }).catch((err) => res.status(404).json(err));
    }
);

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
    '/education', [
        authenticate, [
            check('school', 'School name is required').not().isEmpty(),
            check('fieldofstudy', 'Field of study required').not().isEmpty(),
            check('from', 'From date is required').not().isEmpty(),
            check('degree', 'Degree is required').not().isEmpty()
        ]
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // Return any errors with 400 status
            return res.status(400).json({ errors: errors.array() });
        }
        console.log(req.body)

        Profile.findOne({ user: req.user.id }).then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            };
            console.log(newEdu);
            // Add to exp array
            profile.education.unshift(newEdu);

            profile.save().then(profile => res.json(profile));
        }).catch(err => res.status(404).json(err));
    }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
    '/experience/:exp_id',
    authenticate,
    (req, res) => {
        Profile.findOne({ user: req.user.id })
            .then(profile => {
                // Get remove index
                const removeIndex = profile.experience
                    .map(item => item.id)
                    .indexOf(req.params.exp_id);

                // Splice out of array
                profile.experience.splice(removeIndex, 1);

                // Save
                profile.save().then(profile => res.json(profile));
            })
            .catch(err => res.status(404).json(err));
    }
);
// @route   DELETE api/profile/education/:edu_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
    '/education/:edu_id',
    authenticate,
    (req, res) => {
        Profile.findOne({ user: req.user.id })
            .then(profile => {
                // Get remove index
                const removeIndex = profile.education
                    .map(item => item.id)
                    .indexOf(req.params.edu_id);

                // Splice out of array
                profile.experience.splice(removeIndex, 1);

                // Save
                profile.save().then(profile => res.json(profile));
            })
            .catch(err => res.status(404).json(err));
    }
);

router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubClientSecret')}`,
            method: 'GET',
            headers: {
                'user-agent': 'node.js'
            }
        }
        request(options, (error, response, body) => {
            if (error) console.log(error)
            if (response.statusCode !== 200) {
                return res.statusCode(404).json({ msg: 'Github profile not found' })
            }
            res.json(JSON.parse(body));
        });
    } catch (err) { console.log(err) };
});
// @DELETE api/profile/
// @desc delete user's profile and user and also remove user's posts
//protected
router.delete('/', authenticate, async(req, res) => {
    try {
        await Profile.findOneAndRemove({ user: req.user.id });
        await User.findOneAndRemove({ _id: req.user.id });
        res.status(200).json({ msg: 'User deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;