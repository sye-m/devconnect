const express = require('express');
const authenticate = require('../../middleware/authenticate');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../../models/User');
const Post = require('../../models/Post');


// @GET api/users
// @desc get users
// Not protected
router.get('/', (req, res) => res.send('post route'));


// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
    '/', [
        authenticate, [
            check('text', 'Text is required').not().isEmpty()
        ]
    ],
    async(req, res) => {
        const errors = validationResult(req);
        const user = await User.findById(req.user.id).select('-password');
        // Check Validation
        if (!errors.isEmpty()) {
            // If any errors, send 400 with errors object
            return res.status(400).json(errors);
        }

        console.log(user);
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: user.id
        });

        newPost.save().then(post => res.json(post));
    }
);
//@route GET api/post/all
// @desc get all users posts
//@access not protected
router.get('/all', async(req, res) => {
    try {
        const post = await Post.find().sort({ date: -1 });
        if (!post) {
            return res.status(404).json({ msg: 'No profile found' });
        }
        res.json(post);
    } catch (err) {
        console.log(err);
        if (err.kind == 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send({ msg: 'Server Error' });
    }
});

// @route GET api/post/user/id
// @desc get post by Id
//@access public
router.get('/:id', async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        console.log(err);
        if (err.kind == 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send({ msg: 'Server Error' });
    }
});

router.post('/like/:id', authenticate, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res
                .status(400)
                .json({ alreadyliked: 'User already liked this post' });
        }

        // Add user id to likes array
        post.likes.unshift({ user: req.user.id });

        await post.save();
        res.json(post);
    } catch (err) { res.status(404).json({ postnotfound: 'No post found' }) };
});

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post('/unlike/:id', authenticate, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res
                .status(400)
                .json({ notliked: 'You have not yet liked this post' });
        }

        // Get remove index
        const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

        // Splice out of array
        post.likes.splice(removeIndex, 1);

        // Save
        post.save();
        res.json(post)
    } catch (err) { res.status(404).json({ postnotfound: 'No post found' }) };
});


// @route   POST api/posts/comment/:id
// @desc    Create post
// @access  Private
router.post(
    '/comment/:id', [
        authenticate, [
            check('text', 'Text is required').not().isEmpty()
        ]
    ],
    async(req, res) => {
        try {
            const errors = validationResult(req);
            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.id);

            // Check Validation
            if (!errors.isEmpty()) {
                // If any errors, send 400 with errors object
                return res.status(400).json(errors);
            }

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: user.id
            };

            post.comments.unshift(newComment);
            await post.save();
            res.json(post);
        } catch (err) {
            console.log(err);
            if (err.kind == 'ObjectId') {
                return res.status(404).json({ msg: 'Post not found' });
            }
            res.status(500).send({ msg: 'Server Error' });
        }
    }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete comment
// @access  Private
router.delete(
    '/comment/:id/:comment_id', authenticate,
    async(req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            const comment = post.comments.find(comment => comment.id == req.params.comment_id);
            if (!comment) {
                return res.status(404).json({ msg: 'comment does not exist' });
            }

            if (comment.user.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'User not authorized' });
            }

            const removeIndex = post.comments
                .map(comment => comment.user.toString())
                .indexOf(req.user.id);

            post.comments.splice(removeIndex, 1);

            // Save
            post.save();
            res.json(post)

        } catch (err) {
            console.log(err);
            if (err.kind == 'ObjectId') {
                return res.status(404).json({ msg: 'Post not found' });
            }
            res.status(500).send({ msg: 'Server Error' });
        }
    }
);


// @route DELETE api/post/user/id
// @desc delete user's post by Id
//@access private
router.delete(
    '/:id',
    authenticate,
    async(req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (post.user.toString() !== req.user.id) {
                return res.status(404).json({ msg: 'User not authorized' });
            }
            res.json({ msg: 'Post removed' });
        } catch (err) {
            console.log(err);
            if (err.kind == 'ObjectId') {
                return res.status(404).json({ msg: 'Post not found' });
            }
            res.status(500).send({ msg: 'Server Error' });
        }
    }
);
module.exports = router;