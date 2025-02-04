const express = require("express");
const router = express.Router();
const shortid = require("shortid");
const Url = require("../models/Url");

// Shorten URL
router.post("/shorten", async (req, res) => {
    const { originalUrl } = req.body;
    if (!originalUrl) return res.status(400).json({ error: "URL is required" });

    const shortId = shortid.generate();
    const newUrl = new Url({ originalUrl, shortId });

    await newUrl.save();
    res.json({ shortUrl: `${process.env.BASE_URL}/${shortId}` });
});

// Redirect to Original URL
router.get("/:shortId", async (req, res) => {
    const url = await Url.findOne({ shortId: req.params.shortId });
    if (url) {
        return res.redirect(url.originalUrl);
    } else {
        return res.status(404).json({ error: "URL not found" });
    }
});

module.exports = router;