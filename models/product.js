const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
    authorId: { type: Schema.Types.ObjectId, ref: 'User'},
    rating: Number,
    comment: String
})

const productSchema = new mongoose.Schema({
    kind: String,
    pattern: String,
    title: String,
    url: String,
    description: String,
    estimatedPriceKr: Number,
    images: [String],
    reviews: [reviewSchema]
});

const productModel = mongoose.model('Product', productSchema, 'products');

module.exports = productModel;