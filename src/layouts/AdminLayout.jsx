import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  ChevronDown,
  GalleryHorizontal,
  Home,
  LogOut,
  Package,
  Settings,
  Users,
  MessageSquareText,
  History,
  Users2,
  Bell,
  User,
} from 'lucide-react';
import { useUserRole } from '../services/useUserRole.js';
import { api } from '../services/api.js';

const ADMIN_ROUTE = 'ro-panel-2026';

const allAdminLinks = [
  { label: 'Dashboard', to: `/${ADMIN_ROUTE}/dashboard`, icon: BarChart3 },
  { label: 'Products', to: `/${ADMIN_ROUTE}/products`, icon: Package },
  { label: 'Gallery', to: `/${ADMIN_ROUTE}/gallery`, icon: GalleryHorizontal },
  { label: 'Inquiries', to: `/${ADMIN_ROUTE}/inquiries`, icon: MessageSquareText },
  { label: 'Customers', to: `/${ADMIN_ROUTE}/customers`, icon: Users },
  { label: 'Users', to: `/${ADMIN_ROUTE}/users`, icon: Users2 },
  { label: 'Settings', to: `/${ADMIN_ROUTE}/settings`, icon: Settings },
  { label: 'Audit Logs', to: `/${ADMIN_ROUTE}/audit`, icon: History },
  { label: 'Profile', to: `/${ADMIN_ROUTE}/profile`, icon: User },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user } = useUserRole();

  const adminName =
    user?.name ||
    user?.fullName ||
    user?.email ||
    'Royal Admin';

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('royalAdminAuth');
      localStorage.removeItem('royalAdminToken');
      localStorage.removeItem('royalAdminUser');
      navigate(`/${ADMIN_ROUTE}/login`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      <aside className="sticky top-0 z-30 border-b border-white/10 bg-royal-navy text-white shadow-soft lg:h-screen lg:w-72 lg:border-b-0">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-5 lg:block">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-gold text-lg font-bold text-white">
                RO
              </span>
              <div>
                <h1 className="text-xl font-bold">Royal Overseas</h1>
                <p className="text-xs font-semibold uppercase tracking-wide text-gold">Premium Admin</p>
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">Admin Panel</p>
            {user && <p className="mt-1 text-xs text-blue-100">{user.role}</p>}
          </div>
          <button
            type="button"
            onClick={logout}
            className="grid h-10 w-10 place-items-center rounded-md border border-white/15 text-blue-100 hover:text-gold lg:hidden"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 py-4 lg:grid lg:overflow-visible">
          {allAdminLinks.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-3 rounded-md px-4 py-3 text-sm font-bold transition ${
                  isActive
                    ? 'bg-gold text-white shadow-soft'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={logout}
            className="hidden items-center gap-3 rounded-md px-4 py-3 text-sm font-bold text-blue-100 hover:bg-white/10 hover:text-gold lg:flex"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-5 py-4 shadow-sm backdrop-blur sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gold">Admin Console</p>
              <h2 className="text-xl font-bold text-royal-navy">Welcome, {adminName}</h2>
            </div>
            <div className="flex items-center gap-3">
              <NavLink
                to="/"
                className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-royal-navy transition hover:border-gold hover:text-gold"
                aria-label="Open website"
              >
                <Home size={18} />
              </NavLink>
              <button
                type="button"
                className="relative grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-royal-navy transition hover:border-gold hover:text-gold"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-gold" />
              </button>
              <NavLink
                to={`/${ADMIN_ROUTE}/profile`}
                className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-royal-navy transition hover:border-gold hover:text-gold"
              >
                <span className="grid h-8 w-8 place-items-center rounded-md bg-royal-blue text-xs text-white">
                  {adminName.slice(0, 2).toUpperCase()}
                </span>
                <span className="hidden sm:inline">{adminName}</span>
                <ChevronDown size={16} />
              </NavLink>
            </div>
          </div>
        </header>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
