import React from 'react';
import { Bell, Lock, Eye, Globe, Palette } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Account Settings */}
        <SettingsSection title="Account Settings">
          <div className="space-y-4">
            <SettingsField
              label="Email Address"
              value="john@example.com"
              type="email"
            />
            <SettingsField
              label="Current Password"
              type="password"
              placeholder="Enter current password"
            />
            <SettingsField
              label="New Password"
              type="password"
              placeholder="Enter new password"
            />
          </div>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications" icon={Bell}>
          <div className="space-y-4">
            <ToggleSetting
              label="Email Notifications"
              description="Receive email updates about your practice sessions"
            />
            <ToggleSetting
              label="Practice Reminders"
              description="Get reminded about scheduled practice sessions"
            />
            <ToggleSetting
              label="New Features"
              description="Learn about new features and updates"
            />
          </div>
        </SettingsSection>

        {/* Privacy */}
        <SettingsSection title="Privacy" icon={Lock}>
          <div className="space-y-4">
            <ToggleSetting
              label="Profile Visibility"
              description="Make your profile visible to other users"
            />
            <ToggleSetting
              label="Show Progress"
              description="Display your practice progress publicly"
            />
          </div>
        </SettingsSection>

        {/* Preferences */}
        <SettingsSection title="Preferences" icon={Palette}>
          <div className="space-y-4">
            <SelectSetting
              label="Language"
              options={['English', 'Spanish', 'French']}
              icon={Globe}
            />
            <SelectSetting
              label="Theme"
              options={['Light', 'Dark', 'System']}
              icon={Eye}
            />
          </div>
        </SettingsSection>
      </div>
    </div>
  );
};

const SettingsSection = ({ 
  title, 
  icon: Icon, 
  children 
}: { 
  title: string; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center gap-3 mb-6">
      {Icon && <Icon className="h-5 w-5 text-indigo-600" />}
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </div>
    {children}
  </div>
);

const SettingsField = ({ 
  label, 
  value, 
  type = "text",
  placeholder 
}: {
  label: string;
  value?: string;
  type?: string;
  placeholder?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      defaultValue={value}
      placeholder={placeholder}
      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
    />
  </div>
);

const ToggleSetting = ({ 
  label, 
  description 
}: {
  label: string;
  description: string;
}) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-medium text-gray-800">{label}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
    </label>
  </div>
);

const SelectSetting = ({ 
  label, 
  options,
  icon: Icon 
}: {
  label: string;
  options: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <select className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white">
        {options.map(option => (
          <option key={option} value={option.toLowerCase()}>
            {option}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default SettingsPage;