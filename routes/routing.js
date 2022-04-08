const express = require("express");
const router = express.Router();

const productModel = require("../models/product");
const { dispatchMail } = require("../utility/smtp");

router.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

router.get("/order", async (req, res) => {
    const productsRaw = await productModel
        .find({})
        .sort({ kind: 1, pattern: 1 });

    let products = {};
    for (let i = 0; i < productsRaw.length; i++) {
        if (!products[productsRaw[i].kind]) products[productsRaw[i].kind] = [];

        products[productsRaw[i].kind] = [
            ...products[productsRaw[i].kind],
            productsRaw[i],
        ];
    }

    res.render("order", { title: "Order", products });
});

// 404 page
router.get("*", (req, res) => {
    res.status(404).render("404", { title: "404" });
});

module.exports = router;
