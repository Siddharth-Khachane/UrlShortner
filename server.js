const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const shortid = require("shortid");

dotenv.config();

const app = express();
app.use(express.json());

// Allow specific frontend origin
app.use(cors({
    origin: "https://siddharth-khachane.github.io",
    methods: "GET,POST",
    allowedHeaders: "Content-Type"
}));

const MONGO_URI = process.env.MONGO_URI || "your_mongodb_atlas_url";
const BASE_URL = process.env.BASE_URL || "https://your-backend-url.com";

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Define URL Schema
const UrlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortId: { type: String, required: true, unique: true }
});

const Url = mongoose.model("Url", UrlSchema);

// API Route: Shorten URL
app.post("/api/url/shorten", async (req, res) => {
    const { originalUrl } = req.body;
    if (!originalUrl) return res.status(400).json({ error: "URL is required" });

    let url = await Url.findOne({ originalUrl });
    if (url) {
        return res.json({ shortUrl: `${BASE_URL}/${url.shortId}` });
    }

    const shortId = shortid.generate();
    url = new Url({ originalUrl, shortId });

    await url.save();
    res.json({ shortUrl: `${BASE_URL}/${shortId}` });
});

// API Route: Redirect to Original URL
app.get("/:shortId", async (req, res) => {
    const url = await Url.findOne({ shortId: req.params.shortId });
    if (url) {
        return res.redirect(url.originalUrl);
    } else {
        return res.status(404).json({ error: "URL not found" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
