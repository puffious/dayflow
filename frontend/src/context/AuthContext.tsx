import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { API_ENDPOINTS } from '@/lib/api';

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
        await fetchEmployeeDetails(session.user.email!);
      } else {
        setUser(null);
        setEmployeeDetails(null);
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchEmployeeDetails = async (email: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.employees);
      if (!response.ok) throw new Error('Failed to fetch employees');
      const employees = await response.json();
      const currentEmployee = employees.find((emp: EmployeeDetails) => emp.email === email);
      if (currentEmployee) {
        setEmployeeDetails(currentEmployee);
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName }
      }
    });

    if (authError) throw authError;

    // Create employee record
    if (authData.user) {
      const response = await fetch(API_ENDPOINTS.employees, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: authData.user.id,
          email,
          first_name: firstName,
          last_name: lastName
        })
      });
      if (!response.ok) throw new Error('Failed to create employee record');
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
