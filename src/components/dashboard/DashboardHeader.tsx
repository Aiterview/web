import { Link } from 'react-router-dom';
import { BrainCog, Settings } from 'lucide-react';
import UserMenu from './UserMenu';

const DashboardHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2">
            <BrainCog className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">Aiterview</span>
          </Link>
          
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
            />
          </div> */}
        </div>

        <div className="flex items-center gap-4">
          {/* <button className="p-2 rounded-lg hover:bg-gray-100 relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button> */}
          <Link to="/dashboard/settings" className="p-2 rounded-lg hover:bg-gray-100">
            <Settings className="h-5 w-5 text-gray-600" />
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;