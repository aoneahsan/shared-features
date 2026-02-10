import { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Shield,
  Package,
  Menu,
  X,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { logout } from '@/services/auth-service';
import { APP_NAME } from '@/config/constants';

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const DASHBOARD_NAV: SidebarLink[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Admin Panel', href: '/admin', icon: Shield, adminOnly: true },
];

/**
 * Dashboard layout with a fixed sidebar on desktop and a toggleable
 * overlay sidebar on mobile. Shows user info and navigation links.
 */
export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
  };

  const visibleLinks = DASHBOARD_NAV.filter(
    (link) => !link.adminOnly || isAdmin,
  );

  return (
    <div className="flex min-h-screen bg-surface-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-surface-200 bg-white transition-transform duration-200 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-surface-200 px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
              <Package className="h-4 w-4" />
            </div>
            <span className="font-display text-base font-bold text-surface-900">
              {APP_NAME}
            </span>
          </Link>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 hover:bg-surface-100 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="flex flex-col gap-1">
            {visibleLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === '/dashboard'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900',
                  )
                }
              >
                <link.icon className="h-4.5 w-4.5 shrink-0" />
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Back to Website */}
        <div className="border-t border-surface-200 px-3 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-surface-500 transition-colors hover:bg-surface-100 hover:text-surface-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Website
          </Link>
        </div>

        {/* User Info */}
        <div className="border-t border-surface-200 px-4 py-4">
          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User avatar'}
                className="h-8 w-8 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <span className="text-sm font-medium">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-surface-900">
                {user?.displayName || 'User'}
              </p>
              <p className="truncate text-xs text-surface-500">
                {user?.email || ''}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-8 w-8 shrink-0 p-0"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-surface-200 bg-white/80 px-4 backdrop-blur-lg sm:px-6">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-surface-600 hover:bg-surface-100 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-display text-lg font-semibold text-surface-900">
            Dashboard
          </h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
