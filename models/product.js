const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    kind: String,
    pattern: String,
    title: String,
    url: String,
    description: String,
    estimatedPriceKr: Number,
    images: [String]
});

const productModel = mongoose.model('Product', productSchema, 'products');

module.exports = productModel;