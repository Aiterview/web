import { Link } from 'react-router-dom';
import { 
  User,
  Settings,
  CreditCard,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuthStore();

  const menuItems = [
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    { icon: CreditCard, label: 'Créditos', path: '/dashboard/billing' },
    { icon: HelpCircle, label: 'Help & Support', path: '/dashboard/support' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100"
      >
        <img
          src="https://i.pravatar.cc/32"
          alt="User"
          className="w-8 h-8 rounded-full"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-medium text-gray-800">John Doe</p>
            <p className="text-sm text-gray-500">john@example.com</p>
          </div>

          <div className="py-2">
            {menuItems.map(({ icon: Icon, label, path }) => (
              <Link
                key={path}
                to={path}
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-2 mt-2">
            <button
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
            >
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;