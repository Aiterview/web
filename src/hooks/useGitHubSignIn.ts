import { useState } from 'react';
import { supabase } from '../lib/supabase/supabaseClient';
import { useModalStore } from '../store/modelStore';
import { useToastStore } from '../store/toastStore';

export const useGitHubSignIn = (): { signIn: () => Promise<void>; loading: boolean } => {
  const { showToast } = useToastStore();
  const { open } = useModalStore();
  const [loading, setLoading] = useState(false);

  const signIn = async (): Promise<void> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin,
          scopes: 'email profile',
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        console.error('GitHub sign-in error:', error);
        showToast({ message: error.message || 'An error occurred during sign in.', type: 'error' });
        open('authenticationModal');
      }
    } catch (error) {
      console.error('Unexpected error during GitHub sign-in:', error);
      showToast({
        message: error instanceof Error ? error.message : 'An unexpected error occurred.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading };
};