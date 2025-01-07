import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        onMenuClick={() => setSidebarOpen(true)}
        onClose={() => setSidebarOpen(false)}
        isOpen={isSidebarOpen}
      />
      <div className="flex">
        <DashboardSidebar 
          isOpen={isSidebarOpen}
        />
        <main className="flex-1 lg:ml-64 p-8 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;