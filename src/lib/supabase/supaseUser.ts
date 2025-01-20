import { supabase } from "./supabaseClient";

const { data } = await supabase.auth.getUser();
const id = data.user?.id;

const user = await supabase.schema('public').from('profiles').select('*').eq('id', id).single();

export { user }