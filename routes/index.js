const express = require('express');
const router = express.Router();
const passportConfig = require('../config/passport');
const fb = require('../modules/fb');

router.get('/', function(req, res) {

    res.render('index', { title: 'Home', message: 'Hello there!'});
});
router.get('/imprint', function(req, res) {
    res.render('imprint', { title: 'Imprint', message: 'Hello there!'});
});

router.get('/dashboard', function(req, res) {
    res.render('app/index', { title: 'Dashboard', message: 'Hello there!'});
});

router.get('/search', function(req, res) {
    res.render('app/index', { title: 'Search', message: 'Hello there!'});
});

router.get('/facebook', function(req, res) {
    fb.getPosts().then(result => {
        console.log(result);
        res.render('app/index', { title: 'Hey', message: 'Hello there!', fb : result.data});
    });
});

module.exports = router;
