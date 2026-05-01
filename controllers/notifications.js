const Notification = require('../models/notification.js');

module.exports.index = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 });

        res.render('notifications/index.ejs', {
            notifications,
            currUser: req.user || null
        });
    } catch (err) {
        next(err);
    }
};

module.exports.markAsRead = async (req, res, next) => {
    try {
        const { notificationId } = req.params;
        const notification = await Notification.findById(notificationId);

        if (!notification) {
            req.flash('error', 'Notification not found.');
            return res.redirect('/notifications');
        }

        if (!notification.recipient.equals(req.user._id)) {
            req.flash('error', 'You cannot update this notification.');
            return res.redirect('/notifications');
        }

        notification.isRead = true;
        await notification.save();

        req.flash('success', 'Notification marked as read.');
        res.redirect('/notifications');
    } catch (err) {
        next(err);
    }
};

module.exports.markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );

        req.flash('success', 'All notifications marked as read.');
        res.redirect('/notifications');
    } catch (err) {
        next(err);
    }
};
