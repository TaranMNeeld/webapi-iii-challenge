const express = require('express');

const db = require('./userDb.js');

const router = express.Router();

router.post('/', (req, res) => {

});

router.post('/:id/posts', validateUserId, (req, res) => {

});

router.get('/', (req, res) => {

});

router.get('/:id', validateUserId, (req, res) => {

});

router.get('/:id/posts', validateUserId, (req, res) => {

});

router.delete('/:id', validateUserId, (req, res) => {

});

router.put('/:id', validateUserId, (req, res) => {

});

//custom middleware

function validateUserId(req, res, next) {
    console.log('validating user id');
    const id = req.params.id;
    if (id) {
        
    }
    next();
};

function validateUser(req, res, next) {
    next();
};

function validatePost(req, res, next) {
    next();
};

module.exports = router;
