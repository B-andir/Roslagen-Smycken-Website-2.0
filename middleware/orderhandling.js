const express = require("express");
const router = express.Router();

const productModel = require("../models/product");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET);

router.post("/buy", async (req, res) => {
    const product = await productModel.findById(req.body.productID);
    if (!product) return res.status(404).send("Product not found");

    const stripePoduct = await stripe.products.create({
        name: product.title,
        description: product.description,
    });

    const price = await stripe.prices.create({
        unit_amount: product.estimatedPriceKr * req.body.selectedLength * 100,
        currency: "sek",
        product: stripePoduct.id,
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

module.exports = router;
