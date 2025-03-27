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

interface DashboardSidebarProps {
  isOpen: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen }) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Start Practice', path: '/dashboard' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
    //{ icon: Calendar, label: 'Practice Sessions', path: '/dashboard/sessions' },
    //{ icon: Clock, label: 'History', path: '/dashboard/history' },
    //{ icon: Star, label: 'Saved Questions', path: '/dashboard/saved' },
    { icon: CreditCard, label: 'Credits', path: '/dashboard/billing' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    { icon: HelpCircle, label: 'Help & Support', path: '/dashboard/support' },
  ];

  return (
    <aside
      className={`fixed top-16 left-0 w-64 h-full bg-white border-r border-gray-200 p-4 z-50 transform transition-transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:top-16 lg:h-[calc(100vh-4rem)]`}
    >
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