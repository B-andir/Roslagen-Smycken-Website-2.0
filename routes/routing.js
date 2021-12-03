const express = require('express');
const router = express.Router();
// const fs = require('fs');

router.get('/', (req, res) => {
    res.render('index', {title: 'Home'});
});

router.get('/order', (req, res) => {
    res.render('order', {title: 'Order'});
});

router.get('/order/admin/build', (req, res) => {
    res.render('order_builder', {title: 'ADMIN | Order Builder'});
});


// 404 page
router.get('*',(req, res) => {
    res
        .status(404)
        .render('404');
});

module.exports = router;