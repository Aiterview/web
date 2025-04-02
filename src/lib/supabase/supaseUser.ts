import { supabase } from "./supabaseClient";

export const getUserProfile = async () => {
  const { data } = await supabase.auth.getUser();
  const id = data.user?.id;
  
  if (!id) {
    return { data: { full_name: '', email: '', phone: '', location: '', profession: '', company: '', created_at: Date.now(), avatar_url: '' } };
  }
  
  const user = await supabase.schema('public').from('profiles').select('*').eq('id', id).single();
  return user;
};

export const updateUserProfile = async (profileData: {
  full_name?: string;
  phone?: string;
  location?: string;
  profession?: string;
  company?: string;
  avatar_url?: string;
}) => {
  const { data: authData } = await supabase.auth.getUser();
  const id = authData.user?.id;
  
  if (!id) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .schema('public')
    .from('profiles')
    .update(profileData)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    throw error;
  }
  
  return { data, error: null };
};

export const uploadAvatar = async (file: File) => {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Validate the file type
    if (!file.type.startsWith('image/')) {
      throw new Error('The selected file is not a valid image');
    }
    
    // Check file size - limit to 1MB
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Image is too large. Maximum size is 1MB');
    }
    
    // Get the file extension
    const fileExt = file.name.split('.').pop();
    // Create a unique name for the file
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    
    // Use the built-in "storage" bucket that comes with every Supabase project
    const filePath = `${userId}/${fileName}`;
    
    // Upload the file directly to the storage bucket
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (uploadError) {
      console.error('Upload error:', uploadError);
      // Se o erro for porque o bucket não existe, forneça uma mensagem mais clara
      if (uploadError.message.includes('bucket') && uploadError.message.includes('not found')) {
        throw new Error('The storage system is not correctly configured. The "avatars" bucket needs to be created in the Supabase project.');
      }
      throw uploadError;
    }
    
    // Get the public URL of the file
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
      
    const avatarUrl = data.publicUrl;
    
    // Update the user profile with the new avatar URL
    const updatedProfile = await updateUserProfile({
      avatar_url: avatarUrl
    });
    
    return updatedProfile;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};