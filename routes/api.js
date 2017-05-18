const express = require('express');
const router = express.Router();
const passportConfig = require('../config/passport');
const fb = require('../modules/fb');


router.get('/get/fb/posts', function(req, res) {
    fb.getPosts('113878732017445').then(result => {
        res.status(200).json(result)
    });
});

router.post('/post/fb/posts', function(req, res) {

    fb.getPosts(req.body.id, req.body.start, req.body.end).then(result => {
        res.status(200).json(result)
    });
});


router.get('/get/fb/search', function(req, res) {
    fb.searchUser().then(result => {
        res.status(200).json(result)
    });
});

router.post('/post/fb/search', function(req, res) {

    fb.searchUser(req.body.query).then(result => {
        res.status(200).json(result.data)
    });
});

module.exports = router;