import { useState, useEffect } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { api } from '../../services/api.js';
import AdminPageHeader from '../../components/admin/AdminPageHeader.jsx';

const ACTION_COLORS = {
  login: 'bg-green-100 text-green-800',
  logout: 'bg-blue-100 text-blue-800',
  create: 'bg-purple-100 text-purple-800',
  update: 'bg-yellow-100 text-yellow-800',
  delete: 'bg-red-100 text-red-800',
  view: 'bg-gray-100 text-gray-800',
  login_failed: 'bg-red-100 text-red-800',
};

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    action: '',
    resource: '',
    startDate: '',
    endDate: '',
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [pagination.page, filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.action && { action: filters.action }),
        ...(filters.resource && { resource: filters.resource }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });

      const data = await api.get(`/api/audit-logs?${queryParams}`);
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.get('/api/audit-logs/stats/overview');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, page: 1 });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
      <div className="space-y-6 p-5 sm:p-8">
        <AdminPageHeader
          title="Audit Logs"
          description="View all admin activity and system actions"
        />

        {stats && (
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-600">Total Actions</h4>
              <p className="mt-2 text-2xl font-bold">
                {stats.byAction.reduce((sum, item) => sum + item.count, 0)}
              </p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-600">Successful</h4>
              <p className="mt-2 text-2xl font-bold text-green-600">
                {stats.byStatus.find((item) => item._id === 'success')?.count || 0}
              </p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-600">Failed</h4>
              <p className="mt-2 text-2xl font-bold text-red-600">
                {stats.byStatus.find((item) => item._id === 'failure')?.count || 0}
              </p>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Filter size={18} />
            <div className="flex flex-1 gap-4">
              <select
                value={filters.action}
                onChange={(e) => handleFilterChange('action', e.target.value)}
                className="rounded border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">All Actions</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="view">View</option>
              </select>

              <select
                value={filters.resource}
                onChange={(e) => handleFilterChange('resource', e.target.value)}
                className="rounded border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">All Resources</option>
                <option value="user">User</option>
                <option value="product">Product</option>
                <option value="gallery">Gallery</option>
                <option value="inquiry">Inquiry</option>
                <option value="customer">Customer</option>
              </select>

              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-gray-500" />
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="rounded border border-gray-300 px-3 py-2 text-sm"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow-sm">
          {loading ? (
            <div className="p-6 text-center">Loading audit logs...</div>
          ) : logs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No logs found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Time</th>
                    <th className="px-6 py-3 text-left font-semibold">User</th>
                    <th className="px-6 py-3 text-left font-semibold">Action</th>
                    <th className="px-6 py-3 text-left font-semibold">Resource</th>
                    <th className="px-6 py-3 text-left font-semibold">Details</th>
                    <th className="px-6 py-3 text-left font-semibold">Status</th>
                    <th className="px-6 py-3 text-left font-semibold">IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 text-gray-600">{formatDate(log.timestamp)}</td>
                      <td className="px-6 py-3">{log.userEmail}</td>
                      <td className="px-6 py-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${ACTION_COLORS[log.action] || 'bg-gray-100'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-3">{log.resource || '-'}</td>
                      <td className="max-w-xs truncate px-6 py-3 text-gray-600">{log.details}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            log.status === 'success'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-600">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t bg-gray-50 px-6 py-3">
              <div className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.pages} ({pagination.total} total)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                  disabled={pagination.page === 1}
                  className="rounded border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination({ ...pagination, page: Math.min(pagination.pages, pagination.page + 1) })}
                  disabled={pagination.page === pagination.pages}
                  className="rounded border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
