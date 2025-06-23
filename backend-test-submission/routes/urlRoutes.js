const express = require('express');
const router = express.Router();
const {
  createShortUrl,
  redirectToLongUrl,
  getAnalytics
} = require('../controllers/urlController');

router.post('/shorturls', createShortUrl);
router.get('/:shortcode', redirectToLongUrl);
router.get('/shorturls/:shortcode', getAnalytics);

module.exports = router;
