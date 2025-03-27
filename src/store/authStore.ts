import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '../lib/supabase/supabaseClient';
import { loadingStore } from './loadingStore';
import { AuthProvider } from '../types/authProvider';

interface UserData {
  email: string;
  name?: string;
  provider?: AuthProvider;
  emailVerified?: boolean;
  id?: string;
}

interface AuthError extends Error {
  status?: number;
  message: string;
}

interface IAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: UserData | null;
  error: string | null;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setUser: (user: IAuthState['user']) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

export const useAuthStore = create<IAuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: true,
      accessToken: null,
      refreshToken: null,
      user: null,
      error: null,
      setAuthenticated: value => set({ isAuthenticated: value }),
      setLoading: value => set({ isLoading: value }),
      setUser: user => set({ user, isAuthenticated: !!user }),
      setAccessToken: token => set({ accessToken: token }),
      setRefreshToken: token => set({ refreshToken: token }),
      setError: error => set({ error }),
      logout: () => set({ 
        user: null, 
        isAuthenticated: false, 
        accessToken: null, 
        refreshToken: null, 
        error: null 
      }),
      
      signInWithEmail: async (email, password) => {
        try {
          loadingStore.getState().setLoading(true);
          set({ error: null });
          
          const { data, error } = await supabase.auth.signInWithPassword({ 
            email, 
            password 
          });
          
          if (error) {
            set({ error: error.message });
            throw error;
          }
          
          if (data.user) {
            const emailVerified = !!data.user.email_confirmed_at;
            set({
              user: {
                id: data.user.id,
                email: data.user.email || '',
                name: data.user.user_metadata?.name,
                provider: AuthProvider.EMAIL,
                emailVerified
              },
              accessToken: data.session?.access_token || null,
              refreshToken: data.session?.refresh_token || null,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
          }
        } catch (error) {
          const authError = error as AuthError;
          set({ 
            error: authError.message,
            isLoading: false 
          });
          throw authError;
        } finally {
          loadingStore.getState().setLoading(false);
        }
      },
      
      signUpWithEmail: async (email, password) => {
        try {
          loadingStore.getState().setLoading(true);
          set({ error: null });
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) {
            set({ error: error.message });
            throw error;
          }

          if (!data.user?.identities?.length) {
            const conflictError = new Error('An account with this email already exists');
            set({ error: conflictError.message });
            throw conflictError;
          }

          if (data.user) {
            const emailVerified = !!data.user.email_confirmed_at;
            set({
              user: {
                id: data.user.id,
                email: data.user.email || '',
                name: data.user.user_metadata?.name,
                provider: AuthProvider.EMAIL,
                emailVerified
              },
              accessToken: data.session?.access_token || null,
              refreshToken: data.session?.refresh_token || null,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
          }
        } catch (error) {
          const authError = error as AuthError;
          set({ 
            error: authError.message,
            isLoading: false 
          });
          throw authError;
        } finally {
          loadingStore.getState().setLoading(false);
        }
      },
      
      signOut: async () => {
        try {
          loadingStore.getState().setLoading(true);
          set({ error: null });
          
          const { error } = await supabase.auth.signOut();
          
          if (error && !error.message?.includes('Auth session missing')) {
            set({ error: error.message });
            throw error;
          }
          
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false, 
            accessToken: null,
            refreshToken: null,
            error: null 
          });
        } catch (error) {
          // Even with error, we still clean the state to avoid session problems
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false, 
            accessToken: null,
            refreshToken: null 
          });
          
          const authError = error as AuthError;
          set({ error: authError.message });
          throw authError;
        } finally {
          loadingStore.getState().setLoading(false);
        }
      },
      
      refreshSession: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const { data, error } = await supabase.auth.refreshSession();
          
          if (error) {
            set({ error: error.message });
            return false;
          }
          
          if (data.session) {
            set({
              accessToken: data.session.access_token,
              refreshToken: data.session.refresh_token,
              isAuthenticated: true,
              error: null
            });
            
            if (data.user) {
              const emailVerified = !!data.user.email_confirmed_at;
              set({
                user: {
                  id: data.user.id,
                  email: data.user.email || '',
                  name: data.user.user_metadata?.name,
                  provider: determineProvider(data.user),
                  emailVerified
                }
              });
            }
            
            return true;
          }
          
          return false;
        } catch (error) {
          const authError = error as AuthError;
          set({ 
            error: authError.message,
            isLoading: false 
          });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
      
      initializeAuth: async () => {
        try {
          loadingStore.getState().setLoading(true);
          set({ isLoading: true, error: null });
          
          const {
            data: { session },
            error
          } = await supabase.auth.getSession();
          
          if (error) {
            set({ error: error.message });
            throw error;
          }
          
          if (session?.user) {
            const emailVerified = !!session.user.email_confirmed_at;
            set({
              user: {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name,
                provider: determineProvider(session.user),
                emailVerified
              },
              accessToken: session.access_token || null,
              refreshToken: session.refresh_token || null,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          const authError = error as AuthError;
          set({ 
            error: authError.message,
            isLoading: false 
          });
        } finally {
          loadingStore.getState().setLoading(false);
        }
      },
      
      changePassword: async (currentPassword, newPassword) => {
        try {
          loadingStore.getState().setLoading(true);
          set({ error: null });
          
          const currentUser = get().user;
          if (!currentUser?.email) {
            const noUserError = new Error('No authenticated user found');
            set({ error: noUserError.message });
            throw noUserError;
          }

          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: currentUser.email,
            password: currentPassword,
          });

          if (signInError) {
            set({ error: signInError.message });
            throw signInError;
          }

          const { error } = await supabase.auth.updateUser({
            password: newPassword,
          });

          if (error) {
            set({ error: error.message });
            throw error;
          }
        } catch (error) {
          const authError = error as AuthError;
          set({ error: authError.message });
          throw authError;
        } finally {
          loadingStore.getState().setLoading(false);
        }
      },
      
      resetPassword: async (email: string) => {
        try {
          loadingStore.getState().setLoading(true);
          set({ error: null });
          
          // Send the email with the link to update the password
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`,
          });
          
          if (error) {
            set({ error: error.message });
            throw error;
          }
        } catch (error) {
          const authError = error as AuthError;
          set({ error: authError.message });
          throw authError;
        } finally {
          loadingStore.getState().setLoading(false);
        }
      },
      
      updatePassword: async (newPassword: string) => {
        try {
          loadingStore.getState().setLoading(true);
          set({ error: null });
          
          console.log('Updating password...');
          
          // Check if we have a valid session
          const { data: sessionData } = await supabase.auth.getSession();
          console.log('Current session:', sessionData);
          
          // Update the password
          const { data, error } = await supabase.auth.updateUser({
            password: newPassword,
          });
          
          if (error) {
            console.error('Error updating password:', error);
            set({ error: error.message });
            throw error;
          }
          
          console.log('Password updated successfully, user:', data.user);
          
          // Clear any recovery/verification token in the session
          if (sessionData.session?.user?.aud === 'recovery') {
            console.log('Logging out after password recovery');
            // After updating the password, logout to force a new login with the new password
            await supabase.auth.signOut();
            set({ 
              user: null, 
              isAuthenticated: false, 
              accessToken: null,
              refreshToken: null,
              error: null 
            });
          }
        } catch (error) {
          const authError = error as AuthError;
          set({ error: authError.message });
          throw authError;
        } finally {
          loadingStore.getState().setLoading(false);
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken
      }),
    }
  )
);

// Helper function to determine the authentication provider
function determineProvider(user: any): AuthProvider {
  if (!user) return AuthProvider.EMAIL;
  
  // Check if there are providers in the app_metadata
  if (user.app_metadata?.providers?.length) {
    const providers = user.app_metadata.providers;
    
    // Filter 'email' if there are multiple providers
    const cleanedProviders = providers.filter((p: string) => p !== 'email');
    
    // Return the first non-email provider, or EMAIL if there are no others
    return (cleanedProviders.length > 0 ? cleanedProviders[0] : AuthProvider.EMAIL) as AuthProvider;
  }
  
  // Check if there is a specific provider defined
  if (user.app_metadata?.provider) {
    return user.app_metadata.provider as AuthProvider;
  }
  
  return AuthProvider.EMAIL;
}

// Initialize auth state when the store is created
useAuthStore.getState().initializeAuth();

// Configure listener for authentication state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    const emailVerified = !!session.user.email_confirmed_at;
    useAuthStore.setState({
      user: {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name,
        provider: determineProvider(session.user),
        emailVerified
      },
      accessToken: session.access_token || null,
      refreshToken: session.refresh_token || null,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
    
    // Configure timer to renew the token before it expires
    if (session.expires_at) {
      const expiresInMs = (session.expires_at * 1000) - Date.now() - (60 * 1000); // 1 minute before
      if (expiresInMs > 0) {
        setTimeout(() => {
          useAuthStore.getState().refreshSession();
        }, expiresInMs);
      }
    }
  } else {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  }
});