const express = require('express');

const db = require('./userDb.js');

const router = express.Router();

router.post('/', (req, res) => {
    const userData = req.body;
    db.insert(userData)
        .then(user => {
            res.status(201).json({ message: `added user: ${user.name}` });
        })
        .catch(err => {
            res.status(500).json({ message: "failed to post user to the database" });
        });
});

router.post('/:id/posts', validateUserId, (req, res) => {
    const postData = req.body;
    const id = req.params.id;
    db.getById(id)
        .then(user => {
            console.log(user)
            if (!user[0]) {
                console.log(id);
                res.status(404).json({ message: "The user with the specified ID does not exist." });
            } else if (!postData.text) {
                res.status(400).json({ errorMessage: "Please provide text for the post." });
            } else {
                db.insertComment(postData)
                    .then(post => {
                        res.status(201).json(post);
                    })
                    .catch(err => {
                        res.status(500).json({ error: "There was an error while saving the post to the database" });
                    })
            }
        })
});

router.get('/', (req, res) => {
    db.get()
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
        db.getById(id)
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
    db.findPostComments(id)
        .then(post => {
            if (!post[0]) {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            } else {
                res.status(201).json(post);
            }
        })
        .catch(err => {
            res.status(500).json({ error: "Could not get comments from database" });
        })
});

router.delete('/:id', validateUserId, (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(404).json({ error: "the user with that id does not exist" });
    } else {
        db.remove(id)
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
        db.getById(id)
            .then(user => {
                res.status(200).json(user);
            })
            .catch(err => {
                res.status(500).json({ error: "failed to get user from the database" });
            });
    }
});

//custom middleware

function validateUserId(req, res, next) {
    console.log('validating user id');
    const id = req.params.id;
    db.getById(id)
        .then(user => {
            if (id) {
                req.user = user;
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
    }
    next();
};

function validatePost(req, res, next) {
    const postData = req.body;
    if (!postData) {
        res.status(400).json({ message: "missing post data" });
    } else if (!postData.text) {
        res.status(400).json({ message: "missing required text field" });
    }
    next();
};

module.exports = router;
