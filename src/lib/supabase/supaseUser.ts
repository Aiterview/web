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