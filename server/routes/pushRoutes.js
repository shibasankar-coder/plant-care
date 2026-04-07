const express = require('express');
const router = express.Router();
const { subscribe, sendTestPush, unsubscribe } = require('../controllers/pushController');

router.post('/subscribe', subscribe);
router.post('/test', sendTestPush);
router.post('/unsubscribe', unsubscribe);

module.exports = router;
