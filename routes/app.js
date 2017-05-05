const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('app/index', { title: 'Hey', message: 'Hello there!'});
});

router.get('/compare', function(req, res) {
    res.render('app/index', { title: 'Hey', message: 'Hello there!'});
});

router.get('/partials/:view', function(req, res) {

    var view = req.params.view;
    res.render('app/partials/' + view);

});

module.exports = router;