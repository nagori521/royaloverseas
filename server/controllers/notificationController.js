import Notification from '../models/Notification.js';

export async function getNotifications(req, res) {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const filter = { userId: req.user._id };
    if (unreadOnly === 'true') filter.isRead = false;

    const skip = (page - 1) * limit;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(filter);

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        unread: await Notification.countDocuments({ userId: req.user._id, isRead: false }),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: err.message });
  }
}

export async function markAsRead(req, res) {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update notification', error: err.message });
  }
}

export async function markAllAsRead(req, res) {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update notifications', error: err.message });
  }
}

export async function deleteNotification(req, res) {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete notification', error: err.message });
  }
}

export async function createNotification(userId, type, title, message, metadata = {}) {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      metadata,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    await notification.save();
    return notification;
  } catch (err) {
    console.error('Failed to create notification:', err);
    return null;
  }
}
