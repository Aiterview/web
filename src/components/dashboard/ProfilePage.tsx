import { Camera, Mail, Phone, MapPin, Briefcase, Calendar } from 'lucide-react';

const ProfilePage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-500 relative">
          <button className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30">
            <Camera className="h-5 w-5" />
            <span>Change Cover</span>
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-8">
          <div className="flex justify-between items-end -mt-12">
            <div className="relative">
              <img
                src="https://i.pravatar.cc/128"
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
            <h1 className="text-2xl font-bold text-gray-900">John Doe</h1>
            <p className="text-gray-600">Senior Software Engineer</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="h-5 w-5" />
                <span>john@example.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="h-5 w-5" />
                <span>+1 234 567 890</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>San Francisco, CA</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Briefcase className="h-5 w-5" />
                <span>Tech Corp Inc.</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>Joined January 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        <StatCard title="Practice Sessions" value="24" />
        <StatCard title="Questions Answered" value="120" />
        <StatCard title="Hours Practiced" value="8.5" />
      </div>
    </div>
  );
};

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <p className="text-gray-600">{title}</p>
    <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
  </div>
);

export default ProfilePage;