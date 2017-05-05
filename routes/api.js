const express = require('express');
const router = express.Router();
const passportConfig = require('../config/passport');
const fb = require('../modules/fb');


router.get('/get/fb/posts', function(req, res) {
    fb.getPosts().then(result => {
        res.status(200).json(result)
    });
});

module.exports = router;
