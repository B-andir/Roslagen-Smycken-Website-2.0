const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
    res.render('index', {title: 'Home'});
});

router.get('/order', async (req, res) => {

    mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true });
    const productModel = require('../models/product');

    let productsRaw = await productModel.find({})

    let productsSorted = {}
    
    for (var i = 0; i < productsRaw.length; ++i) {
        var element = productsRaw[i]

        if (productsSorted[element.kind] == undefined) {
            productsSorted[element.kind] = {};
            productsSorted[element.kind][element.pattern] = {};
        } else {
            if (productsSorted[element.kind][element.pattern] == undefined) {
                productsSorted[element.kind][element.pattern] = {};
            }
        }

        productsSorted[element.kind][element.pattern][element.title] = element;
    }

    res.render('order', {title: 'Order', products: productsSorted });
});

// 404 page
router.get('*',(req, res) => {
    res
        .status(404)
        .render('404', {title: '404'});
});

module.exports = router;