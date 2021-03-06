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

    fb.getPosts(req.body.id, req.body.start, req.body.end, req.body.limit).then(result => {
        res.status(200).json(result)
    });
});


router.get('/get/fb/search', function(req, res) {
    fb.searchUser().then(result => {
        res.status(200).json(result)
    });
});

router.get('/get/fb/favorite', function(req, res) {
    fb.getFavData(req.query.favID).then(result => {
        res.status(200).json(result)
    });
});
// 540404695989874 AFD
// 176063032413299 Leo Messi


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