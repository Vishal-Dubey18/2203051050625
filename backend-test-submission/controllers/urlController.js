const { nanoid } = require('nanoid');
const store = require('../utils/store');
const log = require('../../logging-middleware/logger');

const createShortUrl = async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  try {
    if (!url || typeof url !== 'string') {
      await log("backend", "error", "handler", "Invalid or missing URL");
      return res.status(400).json({ message: "Invalid or missing URL" });
    }

    const code = shortcode || nanoid(6);
    const expiry = new Date(Date.now() + validity * 60000);

    if (store[code]) {
      await log("backend", "error", "handler", "Shortcode already exists");
      return res.status(409).json({ message: "Shortcode already exists" });
    }

    store[code] = {
      originalUrl: url,
      createdAt: new Date(),
      expiry,
      clicks: []
    };

    await log("backend", "info", "handler", `Short URL created: ${code}`);

    return res.status(201).json({
      shortLink: `http://localhost:5000/${code}`,
      expiry
    });
  } catch (error) {
    await log("backend", "fatal", "handler", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const redirectToLongUrl = (req, res) => {
  const { shortcode } = req.params;
  const data = store[shortcode];

  if (!data) return res.status(404).send("Shortcode not found");
  if (new Date() > data.expiry) return res.status(410).send("Link expired");

  data.clicks.push({
    timestamp: new Date(),
    referrer: req.get('Referrer') || 'Direct',
    location: "India" // mocked geo-location
  });

  res.redirect(data.originalUrl);
};

const getAnalytics = (req, res) => {
  const { shortcode } = req.params;
  const data = store[shortcode];

  if (!data) return res.status(404).json({ message: "Shortcode not found" });

  res.json({
    originalUrl: data.originalUrl,
    createdAt: data.createdAt,
    expiry: data.expiry,
    totalClicks: data.clicks.length,
    clickDetails: data.clicks
  });
};

module.exports = {
  createShortUrl,
  redirectToLongUrl,
  getAnalytics
};
