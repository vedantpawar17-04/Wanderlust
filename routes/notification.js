const express = require('express');
const router = express.Router();
const wrapAsync = require('../Utils/wrapAsync.js');
const { isLoggedIn } = require('../middleware.js');
const notificationController = require('../controllers/notifications.js');

router.get('/', isLoggedIn, wrapAsync(notificationController.index));
router.put('/read-all', isLoggedIn, wrapAsync(notificationController.markAllAsRead));
router.put('/:notificationId/read', isLoggedIn, wrapAsync(notificationController.markAsRead));

module.exports = router;
