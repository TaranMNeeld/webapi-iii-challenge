const express = require('express');

const userDb = require('./userDb.js');
const postDb = require('../posts/postDb.js');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
    const userData = req.body;
    userDb.insert(userData)
        .then(user => {
            res.status(201).json({ message: `added user: ${userData.name}` });
        })
        .catch(err => {
            res.status(500).json({ message: "failed to post user to the database" });
        });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    const postData = req.body;
    postDb.insert(postData)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the post to the database" });
        })
});

router.get('/', (req, res) => {
    userDb.get()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({ error: "failed to get users from the database" });
        });
});

router.get('/:id', validateUserId, (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(404).json({ error: "the user with that id does not exist" });
    } else {
        userDb.getById(id)
            .then(user => {
                res.status(200).json(user);
            })
            .catch(err => {
                res.status(500).json({ error: "failed to get user from the database" });
            });
    }
});

router.get('/:id/posts', validateUserId, (req, res) => {
    const id = req.params.id;
    userDb.getUserPosts(id)
        .then(posts => {
          res.status(200).json(posts);
        })
        .catch(err => {
            res.status(500).json({ error: "Could not get posts from database" });
        })
});

router.delete('/:id', validateUserId, (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(404).json({ error: "the user with that id does not exist" });
    } else {
        userDb.remove(id)
            .then(user => {
                res.status(200).json(user);
            })
            .catch(err => {
                res.status(500).json({ error: "failed to remove user from the database" });
            });
    }
});

router.put('/:id', validateUserId, (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    if (!id) {
        res.status(404).json({ error: "the user with that id does not exist" });
    } else if (!changes.name) {
        res.status(400).json({ error: "please provide a name for the user" });
    } else {
        userDb.update(id, changes)
            .then(user => {
                res.status(200).json(changes);
            })
            .catch(err => {
                res.status(500).json({ error: "failed to get user from the database" });
            });
    }
});

//custom middleware

function validateUserId(req, res, next) {
    const id = req.params.id;
    userDb.getById(id)
        .then(user => {
            if (id) {
                req.user = user;
                console.log('user id validated')
            } else {
                res.status(400).json({ message: "invalid user id" });
            }
        })
    next();
};

function validateUser(req, res, next) {
    const userData = req.body;
    if (!userData) {
        res.status(400).json({ message: "missing user data" });
    } else if (!userData.name) {
        res.status(400).json({ message: "missing required name field" });
    } else {
        console.log('user validated');
        next();
    }
};

function validatePost(req, res, next) {
    const postData = req.body;
    if (!postData) {
        res.status(400).json({ message: "missing post data" });
    } else if (!postData.text) {
        res.status(400).json({ message: "missing required text field" });
    } else {
        console.log('post validated');
        next();
    }
};

module.exports = router;
