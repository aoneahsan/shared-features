import { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ToggleLeft,
  Megaphone,
  Package,
  Eye,
  Radio,
  Mail,
  User,
  Share2,
  MapPin,
  CreditCard,
  Briefcase,
  Star,
  MessageSquare,
  FolderOpen,
  BarChart3,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { logout } from '@/services/auth-service';
import { APP_NAME } from '@/config/constants';

interface AdminNavItem {
  type: 'link' | 'separator';
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const ADMIN_NAV: AdminNavItem[] = [
  { type: 'link', label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { type: 'separator', label: 'Feature Management' },
  { type: 'link', label: 'Feature Flags', href: '/admin/feature-flags', icon: ToggleLeft },
  { type: 'separator', label: 'Advertising' },
  { type: 'link', label: 'Campaigns', href: '/admin/campaigns', icon: Megaphone },
  { type: 'link', label: 'Products', href: '/admin/products', icon: Package },
  { type: 'link', label: 'Impressions', href: '/admin/impressions', icon: Eye },
  { type: 'separator', label: 'Communications' },
  { type: 'link', label: 'Broadcasts', href: '/admin/broadcasts', icon: Radio },
  { type: 'separator', label: 'Profile & Info' },
  { type: 'link', label: 'Contact Info', href: '/admin/contact-info', icon: Mail },
  { type: 'link', label: 'Developer Info', href: '/admin/developer-info', icon: User },
  { type: 'link', label: 'Social Links', href: '/admin/social-links', icon: Share2 },
  { type: 'link', label: 'Address', href: '/admin/address', icon: MapPin },
  { type: 'separator', label: 'Portfolio' },
  { type: 'link', label: 'Payment Options', href: '/admin/payment-options', icon: CreditCard },
  { type: 'link', label: 'Services', href: '/admin/services', icon: Briefcase },
  { type: 'link', label: 'Skills', href: '/admin/skills', icon: Star },
  { type: 'link', label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { type: 'link', label: 'Projects', href: '/admin/projects', icon: FolderOpen },
  { type: 'separator', label: 'Insights' },
  { type: 'link', label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
];

/**
 * Admin layout with a fixed sidebar containing admin-specific navigation
 * organized by sections with visual separators. Requires admin access.
 */
export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
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
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500 text-white">
              <Shield className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-bold text-surface-900">
                {APP_NAME}
              </span>
              <span className="rounded-md bg-accent-100 px-1.5 py-0.5 text-xs font-semibold text-accent-700">
                Admin
              </span>
            </div>
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
          <div className="flex flex-col gap-0.5">
            {ADMIN_NAV.map((item, index) => {
              if (item.type === 'separator') {
                return (
                  <div
                    key={`sep-${index}`}
                    className={cn('px-3 pb-1 pt-5', index === 0 && 'pt-2')}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">
                      {item.label}
                    </p>
                  </div>
                );
              }

              const Icon = item.icon!;

              return (
                <NavLink
                  key={item.href}
                  to={item.href!}
                  end={item.href === '/admin'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-accent-50 text-accent-700'
                        : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900',
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </NavLink>
              );
            })}
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
                alt={user.displayName || 'Admin avatar'}
                className="h-8 w-8 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                <span className="text-sm font-medium">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-surface-900">
                {user?.displayName || 'Admin'}
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
          <div className="flex items-center gap-2">
            <h1 className="font-display text-lg font-semibold text-surface-900">
              Admin Panel
            </h1>
            <span className="rounded-md bg-accent-100 px-1.5 py-0.5 text-xs font-semibold text-accent-700">
              Admin
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
