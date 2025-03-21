import { useState, useEffect } from 'react';
import { Camera, Mail, Phone, MapPin, Briefcase, Calendar } from 'lucide-react';
import { getUserProfile } from '../../lib/supabase/supaseUser';

const ProfilePage = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [userData, setUserData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    profession: '',
    company: '',
    created_at: Date.now(),
    avatar_url: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userResponse = await getUserProfile();
        
        if (userResponse && userResponse.data) {
          setUserData(userResponse.data);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if(!showEditModal) {
      setShowEditModal(true);
    }
  }

  const month = new Date(userData.created_at).toLocaleString('en-US', { month: 'long' });
  const year = new Date(userData.created_at).getFullYear();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {/* Edit Profile Modal */}
        {showEditModal && (
         <div>
          <div>
            <span>Edit Profile</span>
            {/*name */}
            <EditsField
              label='Full Name'
              value={userData.full_name}
              placeholder={userData.full_name || 'Enter full name'}
            />
            {/*Profession */}
            <EditsField
              label='Profession'
              value={userData.profession}
              placeholder={userData.profession || 'Enter profession'}
            />
            {/*email */}
            <EditsField
              label='Email Address'
              value={userData.email}
              placeholder={userData.email || 'Enter email'}
              type='email'
            />
            {/*phone */}
            <EditsField
              label='Phone Number'
              value={userData.phone}
              placeholder={userData.phone || 'Enter phone number'}
            />
            {/*location */}
            <EditsField
              label='Location'
              value={userData.location}
              placeholder={userData.location || 'Enter location'}
            />
            {/*company */}
            <EditsField
              label='Company'
              value={userData.company}
              placeholder={userData.company || 'Enter company'}
            />
          </div>
         </div> 
        )}

        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-500 relative" />

        {/* Profile Info */}
        <div className="px-8 pb-8">
          <div className="flex justify-between items-end -mt-12">
            <div className="relative">
              <img
                src={userData.avatar_url || 'https://via.placeholder.com/128'}
                alt="Profile"
                className="w-32 h-32 rounded-xl border-4 border-white"
              />
              <button className="absolute bottom-2 right-2 p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <button 
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              onClick={(e) => handleEdit(e)}
            >
              Edit Profile
            </button>
          </div>

          <div className="mt-6">
            <h1 className="text-2xl font-bold text-gray-900">{userData.full_name || 'No name provided'}</h1>
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

const EditsField = ({ 
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

export default ProfilePage;