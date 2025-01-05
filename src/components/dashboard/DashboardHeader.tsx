import { Link } from 'react-router-dom';
import { BrainCog, Menu, Settings, X } from 'lucide-react';
import UserMenu from './UserMenu';
import React from 'react';

interface DashboardHeaderProps {
  onMenuClick: () => void;
  onClose: () => void;
  isOpen: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuClick, onClose, isOpen }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2">
            <BrainCog className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">Aiterview</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/dashboard/settings" className="p-2 rounded-lg hover:bg-gray-100">
            <Settings className="h-5 w-5 text-gray-600" />
          </Link>
          <UserMenu />
          {!isOpen ? (
            <button
              className="block lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>)
          :
            <button
              className="block lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={onClose}
            >
              <X className="h-5 w-5 text-gray-600"/>
            </button>
          }
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;