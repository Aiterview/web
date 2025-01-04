import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormInputProps {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: LucideIcon;
  required?: boolean;
  disabled?: boolean;
}

const FormInput = ({
  id,
  type,
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = true,
}: FormInputProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                   focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                   bg-white/80 backdrop-blur-sm"
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  );
};

export default FormInput;