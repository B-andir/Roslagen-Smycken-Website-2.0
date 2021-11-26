const express = require('express');
const router = express.Router();
// const fs = require('fs');

router.get('/', (req, res) => {
    res.render('index', {title: 'Home'});
});



// 404 page
router.get((req, res) => {
    res
        .status(404)
        .render('404');
});

module.exports = router;