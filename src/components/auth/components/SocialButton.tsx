import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SocialButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

const SocialButton = ({ icon: Icon, label, onClick }: SocialButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg
               hover:bg-gray-50 transition-all duration-300 hover:border-indigo-300
               bg-white/80 backdrop-blur-sm"
    >
      <Icon className="h-5 w-5 mr-2 text-gray-600" />
      <span className="text-gray-700">{label}</span>
    </button>
  );
};

export default SocialButton;