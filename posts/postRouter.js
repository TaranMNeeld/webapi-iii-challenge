const express = require('express');

const db = require('./postDb.js');

const router = express.Router();

router.get('/', (req, res) => {
    db.get()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => {
        res.status(500).json(err)
    })
});

router.get('/:id', (req, res) => {
    let id = req.params.id
    db.getById(id)
    .then(post => {
        res.status(200).json(post)
    })
    .catch(err => {
        res.status(500).json(err)
    })
});

router.delete('/:id', (req, res) => {
    let id = req.params.id
    db.remove(id)
    .then(post => {
        res.status(200).json(post)
    })
    .catch(err => {
        res.status(500).json(err)
    })
});

router.put('/:id', validatePost, (req, res) => {
    let id = req.params.id
    let changes = req.body
    db.update(id, changes)
    .then(post => {
        res.status(200).json(post)
    })
    .catch(err => {
        res.status(500).json(err)
    })
});

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