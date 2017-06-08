const express = require('express');
const router = express.Router();
const passportConfig = require('../config/passport');

router.get('/', passportConfig.isAuthenticated, function(req, res) {
    res.render('app/index', { title: 'Dashboard', message: 'Hello there!'});
});

router.get('/search', passportConfig.isAuthenticated, function(req, res) {
    res.render('app/index', { title: 'Search', message: 'Hello there!'});
});
router.get('/search/:id', passportConfig.isAuthenticated, function(req, res) {
    res.render('app/index', { title: 'Search', message: 'Hello there!'});
});


router.get('/compare', passportConfig.isAuthenticated, function(req, res) {
    res.render('app/index', { title: 'Compare', message: 'Hello there!'});
});
router.get('/partials/:view', passportConfig.isAuthenticated, function(req, res) {

    var view = req.params.view;
    res.render('app/partials/' + view);

});

module.exports = router;