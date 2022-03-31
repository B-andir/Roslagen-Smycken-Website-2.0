const express = require("express");
const router = express.Router();

const productModel = require("../models/product");
const { env } = require("process");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET);

router.post("/buy", async (req, res) => {
    productModel.findById(req.body.productID, async (err, _product) => {
        if (err) throw err;

        const product = await stripe.products.create({
            name: _product.title,
            description: _product.description,
        });

        const price = await stripe.prices.create({
            unit_amount:
                _product.estimatedPriceKr * req.body.selectedLength * 100,
            currency: "sek",
            product: product.id,
        });

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: price.id,
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url:
                "https://www.roslagensmycken.com/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "https://www.roslagensmycken.com/cancel",
        });

        return res.json({ targetURL: session.url });
    });
});

module.exports = router;
