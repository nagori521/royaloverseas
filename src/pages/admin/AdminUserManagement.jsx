import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Lock, Unlock } from 'lucide-react';
import { api } from '../../services/api.js';
import AdminPageHeader from '../../components/admin/AdminPageHeader.jsx';

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff',
    permissions: [],
    departments: [],
    status: 'active',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/users');
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);
    try {
      if (editingUser) {
        await api.put(`/api/users/${editingUser._id}`, formData);
        setMessage('User updated successfully');
      } else {
        await api.post('/api/users', formData);
        setMessage('User created successfully');
      }
      setShowForm(false);
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'staff',
        permissions: [],
        departments: [],
        status: 'active',
      });
      fetchUsers();
    } catch (err) {
      console.error('Failed to save user:', err);
      const errorMsg = err.message || 'Failed to save user';
      setError(errorMsg.includes('already exists') ? 'Email already in use' : errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      departments: user.departments,
      status: user.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/api/users/${userId}`);
        setMessage('User deleted successfully');
        fetchUsers();
      } catch (err) {
        console.error('Failed to delete user:', err);
        setError(err.message || 'Failed to delete user');
      }
    }
  };

  const handleDisable = async (userId) => {
    try {
      await api.post(`/api/users/${userId}/disable`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to disable user:', err);
    }
  };

  const handleEnable = async (userId) => {
    try {
      await api.post(`/api/users/${userId}/enable`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to enable user:', err);
    }
  };

  return (
      <div className="space-y-6 p-5 sm:p-8">
        <AdminPageHeader
          title="User Management"
          description="Manage admin users and permissions"
          action={{ label: 'Add User', icon: Plus, onClick: () => setShowForm(true) }}
        />
        {message && <div className="rounded-md bg-green-50 p-3 text-sm font-semibold text-green-800">{message}</div>}
        {error && <div className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

        {showForm && (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">{editingUser ? 'Edit User' : 'Create New User'}</h3>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded border border-gray-300 px-3 py-2"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="rounded border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              {!editingUser && (
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="rounded border border-gray-300 px-3 py-2"
                  required
                />
              )}
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="rounded border border-gray-300 px-3 py-2"
              >
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="super_admin">Super Admin</option>
              </select>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1" disabled={saving}>
                  {saving ? 'Saving...' : (editingUser ? 'Update User' : 'Create User')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingUser(null);
                  }}
                  className="flex-1 rounded bg-gray-200 px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="rounded-lg bg-white shadow-sm">
          {loading ? (
            <div className="p-6 text-center">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3">{user.name}</td>
                      <td className="px-6 py-3">{user.email}</td>
                      <td className="px-6 py-3">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-sm ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="rounded bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          {user.status === 'active' ? (
                            <button
                              onClick={() => handleDisable(user._id)}
                              className="rounded bg-yellow-50 p-2 text-yellow-600 hover:bg-yellow-100"
                              title="Disable"
                            >
                              <Lock size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEnable(user._id)}
                              className="rounded bg-green-50 p-2 text-green-600 hover:bg-green-100"
                              title="Enable"
                            >
                              <Unlock size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="rounded bg-red-50 p-2 text-red-600 hover:bg-red-100"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
  );
}
