import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  //Calendar, 
  //Clock,
  //Star,
  CreditCard,
  Settings,
  HelpCircle
} from 'lucide-react';

const DashboardSidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Start Practice', path: '/dashboard' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
    //{ icon: Calendar, label: 'Practice Sessions', path: '/dashboard/sessions' },
    //{ icon: Clock, label: 'History', path: '/dashboard/history' },
    //{ icon: Star, label: 'Saved Questions', path: '/dashboard/saved' },
    { icon: CreditCard, label: 'Plan & Billing', path: '/dashboard/billing' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    { icon: HelpCircle, label: 'Help & Support', path: '/dashboard/support' },
  ];

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 p-4">
      <nav className="space-y-1">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;