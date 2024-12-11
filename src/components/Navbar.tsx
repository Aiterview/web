import React from 'react';
import { BrainCog } from 'lucide-react';
import { useNavigate } from 'react-router';
import { handleAuthRedirect } from '../utils/handleAuthRedirect';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = true;

  const handleLogoClick = () => {
    navigate('/');
  };
  return (
    <nav className="bg-white/80 backdrop-blur-md fixed w-full z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div onClick={handleLogoClick} className="flex items-center space-x-2 cursor-pointer hover:cursor-pointer">
            <BrainCog className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">Aiterview</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#how-it-works">How It Works</NavLink>
            <NavLink href="#testimonials">Testimonials</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <button 
              onClick={() => handleAuthRedirect(isLoggedIn, navigate)} 
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Start Practicing
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
  >
    {children}
  </a>
);

export default Navbar;