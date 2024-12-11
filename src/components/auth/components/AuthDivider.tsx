import React from 'react';

interface AuthDividerProps {
  text: string;
}

const AuthDivider = ({ text }: AuthDividerProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-white/80 backdrop-blur-sm text-gray-500">{text}</span>
      </div>
    </div>
  );
};

export default AuthDivider;