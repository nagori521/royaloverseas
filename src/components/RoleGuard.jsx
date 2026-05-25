import { useEffect, useState } from 'react';

export default function RoleGuard({ children, roles = [], fallback = null, requiredAll = false }) {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('royalAdminUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role);
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  const isAdmin = localStorage.getItem('royalAdminAuth') === 'true';

  if (isAdmin) return children;

  if (!userRole) return fallback;

  if (roles.length === 0) return children;

  const hasAccess = requiredAll
    ? roles.every((role) => role === userRole)
    : roles.includes(userRole);

  return hasAccess ? children : fallback;
}
