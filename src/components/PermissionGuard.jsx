import { useEffect, useState } from 'react';

export default function PermissionGuard({ children, permissions = [], fallback = null, requireAll = false }) {
  const [userPermissions, setUserPermissions] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('royalAdminUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role);
        setUserPermissions(user.permissions || []);
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  // Super admin has all permissions
  if (userRole === 'super_admin') return children;

  if (permissions.length === 0) return children;

  const hasAccess = requireAll
    ? permissions.every((perm) => userPermissions.includes(perm))
    : permissions.some((perm) => userPermissions.includes(perm));

  return hasAccess ? children : fallback;
}
