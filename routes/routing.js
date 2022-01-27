const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {title: 'Home'});
});

router.get('/order', (req, res) => {
    res.render('order', {title: 'Order'});
});


// 404 page
router.get('*',(req, res) => {
    res
        .status(404)
        .render('404', {title: '404'});
});

module.exports = router;