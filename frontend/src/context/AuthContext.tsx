import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { employeeAPI } from '@/lib/apiClient';

interface User {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
}

interface EmployeeDetails {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  position: string;
  department: string;
  salary?: number;
}

interface AuthContextType {
  user: User | null;
  employeeDetails: EmployeeDetails | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user as User);
          if (session.access_token) {
            localStorage.setItem('auth_token', session.access_token);
          }
          await fetchEmployeeDetails(session.user.email!);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user as User);
        if (session.access_token) {
          localStorage.setItem('auth_token', session.access_token);
        }
        await fetchEmployeeDetails(session.user.email!);
      } else {
        setUser(null);
        setEmployeeDetails(null);
        localStorage.removeItem('auth_token');
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchEmployeeDetails = async (email: string) => {
    try {
      const { data } = await employeeAPI.getMe(email);
      setEmployeeDetails(data);
    } catch (error) {
      console.error('Error fetching employee details:', error);
      setEmployeeDetails(null);
    }
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.session?.access_token) {
      localStorage.setItem('auth_token', data.session.access_token);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    localStorage.removeItem('auth_token');
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}`,
        data: { first_name: firstName, last_name: lastName }
      }
    });

    if (authError) throw authError;

    // Create employee record
    if (authData.user) {
      await employeeAPI.create({
        user_id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      employeeDetails,
      login,
      logout,
      signup,
      loading,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
