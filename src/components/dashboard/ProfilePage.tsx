import { useState, useEffect, useRef } from 'react';
import { Camera, Mail, Phone, MapPin, Briefcase, Calendar, X } from 'lucide-react';
import { getUserProfile, updateUserProfile, uploadAvatar } from '../../lib/supabase/supaseUser';

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
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    location: '',
    profession: '',
    company: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userResponse = await getUserProfile();
        
        if (userResponse && userResponse.data) {
          setUserData(userResponse.data);
          setFormData({
            full_name: userResponse.data.full_name || '',
            phone: userResponse.data.phone || '',
            location: userResponse.data.location || '',
            profession: userResponse.data.profession || '',
            company: userResponse.data.company || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setShowEditModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const response = await updateUserProfile(formData);
      if (response && response.data) {
        setUserData(prev => ({
          ...prev,
          ...response.data
        }));
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
      if (file.size > MAX_FILE_SIZE) {
        alert('The image is too large. The maximum size is 1MB.');
        return;
      }

      setUploadingAvatar(true);
      const response = await uploadAvatar(file);
      if (response && response.data) {
        setUserData(prev => ({
          ...prev,
          avatar_url: response.data.avatar_url
        }));
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      if (error instanceof Error) {
        alert(`Error uploading image: ${error.message}`);
      } else {
        alert('Error uploading image. Please try again.');
      }
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const month = new Date(userData.created_at).toLocaleString('en-US', { month: 'long' });
  const year = new Date(userData.created_at).getFullYear();

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-auto my-8">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">Edit Profile</h2>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[70vh]">
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Profession */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profession
                    </label>
                    <input
                      type="text"
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      placeholder="Your profession"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Email - Disabled as requested */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">The email cannot be changed</p>
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Your location"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 h-10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 h-10"
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Hidden file input for avatar upload */}
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Cover Image */}
        <div className="h-32 sm:h-48 bg-gradient-to-r from-indigo-500 to-purple-500 relative" />

        {/* Profile Info */}
        <div className="px-4 sm:px-8 pb-6 sm:pb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end -mt-12 gap-4">
            <div className="relative">
              <img
                src={userData.avatar_url || 'https://via.placeholder.com/128'}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl border-4 border-white object-cover"
              />
              <button 
                className="absolute bottom-2 right-2 p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                onClick={handleAvatarClick}
                disabled={uploadingAvatar}
                title="Upload profile image (Max: 1MB)"
              >
                {uploadingAvatar ? (
                  <div className="h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="h-4 w-4 text-gray-600" />
                )}
              </button>
            </div>
            <button 
              className="px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 w-full sm:w-auto mt-2 sm:mt-0"
              onClick={(e) => handleEdit(e)}
            >
              Edit Profile
            </button>
          </div>

          <div className="mt-4 sm:mt-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">{userData.full_name || 'Name not provided'}</h1>
            <p className="text-gray-600 break-words">{userData.profession || 'Profession not provided'}</p>
          </div>

          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start sm:items-center gap-3 text-gray-600">
                <Mail className="h-5 w-5 flex-shrink-0 mt-1 sm:mt-0" />
                <span className="break-all">{userData.email || 'Email not provided'}</span>
              </div>
              <div className="flex items-start sm:items-center gap-3 text-gray-600">
                <Phone className="h-5 w-5 flex-shrink-0 mt-1 sm:mt-0" />
                <span className="break-words">{userData.phone || 'Phone not provided'}</span>
              </div>
              <div className="flex items-start sm:items-center gap-3 text-gray-600">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-1 sm:mt-0" />
                <span className="break-words">{userData.location || 'Location not provided'}</span>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4 mt-2 sm:mt-0">
              <div className="flex items-start sm:items-center gap-3 text-gray-600">
                <Briefcase className="h-5 w-5 flex-shrink-0 mt-1 sm:mt-0" />
                <span className="break-words">{userData.company || 'Company not provided'}</span>
              </div>
              <div className="flex items-start sm:items-center gap-3 text-gray-600">
                <Calendar className="h-5 w-5 flex-shrink-0 mt-1 sm:mt-0" />
                <span>Joined in {month} of {year}</span>
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