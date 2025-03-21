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