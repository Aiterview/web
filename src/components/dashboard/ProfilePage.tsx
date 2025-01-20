import { Camera, Mail, Phone, MapPin, Briefcase, Calendar } from 'lucide-react';
import { user } from '../../lib/supabase/supaseUser';

const ProfilePage = () => {
  const userData = user.data;

  const month = new Date(userData.created_at).toLocaleString('en-US', { month: 'long' });
  const year = new Date(userData.created_at).getFullYear();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-500 relative" />

        {/* Profile Info */}
        <div className="px-8 pb-8">
          <div className="flex justify-between items-end -mt-12">
            <div className="relative">
              <img
                src={userData.avatar_url}
                alt="Profile"
                className="w-32 h-32 rounded-xl border-4 border-white"
              />
              <button className="absolute bottom-2 right-2 p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Edit Profile
            </button>
          </div>

          <div className="mt-6">
            <h1 className="text-2xl font-bold text-gray-900">{userData.full_name}</h1>
            <p className="text-gray-600">{userData.profession || 'No profession provided'}</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="h-5 w-5" />
                <span>{userData.email || 'No email provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="h-5 w-5" />
                <span>{userData.phone || 'No phone provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>{userData.location || 'No location provided'}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Briefcase className="h-5 w-5" />
                <span>{userData.company || 'No company provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>Joined {month} {year}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;