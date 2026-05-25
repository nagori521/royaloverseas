import { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import AdminPageHeader from '../../components/admin/AdminPageHeader.jsx';

export default function AdminProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const localUser = JSON.parse(localStorage.getItem('royalAdminUser') || '{}');
      try {
        const remoteUser = await api.get('/api/auth/me');
        setUser({ ...localUser, ...remoteUser });
      } catch {
        setUser(localUser || {
          name: 'Admin User',
          email: 'admin@royaloverseas.com',
          role: 'admin',
          status: 'active',
        });
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      if (user._id && user._id !== '000000000000000000000001') {
        await api.post(`/api/users/${user._id}/change-password`, {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        });
      }
      setMessage('Password changed successfully');
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-red-600">Failed to load profile</div>;
  }

  return (
    <div className="space-y-6 p-5 sm:p-8">
      <AdminPageHeader
        title="Admin Profile"
        description="Manage your account settings"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Card */}
        <div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-1">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-royal-blue text-white text-2xl font-bold">
              {(user.name || 'Admin User').charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <div className="mt-4 space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Role:</span>
                <span className="font-semibold">{user.role}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className={user.status === 'active' ? 'text-green-600' : 'text-red-600'}>
                  {user.status}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Login:</span>
                <span>
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleString()
                    : 'Never'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Tab */}
        <div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex border-b">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 font-semibold ${
                activeTab === 'profile'
                  ? 'border-b-2 border-royal-blue text-royal-blue'
                  : 'text-gray-600'
              }`}
            >
              Profile Info
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-4 py-2 font-semibold ${
                activeTab === 'password'
                  ? 'border-b-2 border-royal-blue text-royal-blue'
                  : 'text-gray-600'
              }`}
            >
              Change Password
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`px-4 py-2 font-semibold ${
                activeTab === 'permissions'
                  ? 'border-b-2 border-royal-blue text-royal-blue'
                  : 'text-gray-600'
              }`}
            >
              Permissions
            </button>
          </div>

          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Name</label>
                <input
                  type="text"
                  value={user.name}
                  readOnly
                  className="mt-2 w-full rounded border border-gray-300 bg-gray-50 px-4 py-2 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="mt-2 w-full rounded border border-gray-300 bg-gray-50 px-4 py-2 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Member Since</label>
                <input
                  type="text"
                  value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                  readOnly
                  className="mt-2 w-full rounded border border-gray-300 bg-gray-50 px-4 py-2 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Last Password Change</label>
                <input
                  type="text"
                  value={user.lastPasswordChange
                    ? new Date(user.lastPasswordChange).toLocaleDateString()
                    : 'Never changed'}
                  readOnly
                  className="mt-2 w-full rounded border border-gray-300 bg-gray-50 px-4 py-2 text-gray-600"
                />
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {message && (
                <div className="rounded-lg bg-green-50 p-4 text-green-800">{message}</div>
              )}
              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-red-800">{error}</div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700">Current Password</label>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, currentPassword: e.target.value })
                  }
                  className="mt-2 w-full rounded border border-gray-300 px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">New Password</label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  className="mt-2 w-full rounded border border-gray-300 px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirmPassword: e.target.value })
                  }
                  className="mt-2 w-full rounded border border-gray-300 px-4 py-2"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Change Password
              </button>
            </form>
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Role</label>
                <div className="mt-2 rounded-lg bg-blue-50 p-4">
                  <p className="font-semibold text-blue-900">{user.role}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Permissions</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {user.permissions && user.permissions.length > 0 ? (
                    user.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
                      >
                        {perm}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-600">No explicit permissions assigned</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Departments</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {user.departments && user.departments.length > 0 ? (
                    user.departments.map((dept) => (
                      <span
                        key={dept}
                        className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800"
                      >
                        {dept}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-600">Not assigned to any department</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
