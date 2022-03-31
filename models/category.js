const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema({
    kind: String,
    products: [String],
});

const categoryModel = mongoose.model("Product", categorySchema, "products");

module.exports = categoryModel;
