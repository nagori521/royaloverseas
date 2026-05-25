import AuditLog from '../models/AuditLog.js';

export async function getAllAuditLogs(req, res) {
  try {
    const { page = 1, limit = 50, action, resource, userId, startDate, endDate } = req.query;

    const filter = {};

    if (action) filter.action = action;
    if (resource) filter.resource = resource;
    if (userId) filter.userId = userId;

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email');

    const total = await AuditLog.countDocuments(filter);

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch audit logs', error: err.message });
  }
}

export async function getAuditLogById(req, res) {
  try {
    const log = await AuditLog.findById(req.params.id).populate('userId', 'name email');

    if (!log) {
      return res.status(404).json({ message: 'Audit log not found' });
    }

    res.json(log);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch audit log', error: err.message });
  }
}

export async function getUserAuditLogs(req, res) {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50, action, resource } = req.query;

    const filter = { userId };

    if (action) filter.action = action;
    if (resource) filter.resource = resource;

    const skip = (page - 1) * limit;

    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await AuditLog.countDocuments(filter);

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user audit logs', error: err.message });
  }
}

export async function getAuditLogStats(req, res) {
  try {
    const { startDate, endDate } = req.query;

    const match = {};

    if (startDate || endDate) {
      match.timestamp = {};
      if (startDate) match.timestamp.$gte = new Date(startDate);
      if (endDate) match.timestamp.$lte = new Date(endDate);
    }

    const stats = await AuditLog.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const resourceStats = await AuditLog.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$resource',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const statusStats = await AuditLog.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      byAction: stats,
      byResource: resourceStats,
      byStatus: statusStats,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch audit stats', error: err.message });
  }
}

export async function deleteOldAuditLogs(req, res) {
  try {
    const { daysOld = 90 } = req.body;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await AuditLog.deleteMany({
      timestamp: { $lt: cutoffDate },
    });

    res.json({
      message: `Deleted ${result.deletedCount} audit logs older than ${daysOld} days`,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete audit logs', error: err.message });
  }
}
