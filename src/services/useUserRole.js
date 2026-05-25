import { useEffect, useState } from 'react';

export function useUserRole() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('royalAdminUser');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
    }
    setLoading(false);
  }, []);

  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return user.permissions?.includes(permission) || false;
  };

  const hasAnyPermission = (permissions) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return permissions.some((perm) => user.permissions?.includes(perm));
  };

  const hasAllPermissions = (permissions) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return permissions.every((perm) => user.permissions?.includes(perm));
  };

  const hasDepartment = (department) => {
    if (!user) return false;
    return user.departments?.includes(department) || false;
  };

  const isInDepartments = (departments) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return departments.some((dept) => user.departments?.includes(dept));
  };

  return {
    user,
    loading,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasDepartment,
    isInDepartments,
  };
}
