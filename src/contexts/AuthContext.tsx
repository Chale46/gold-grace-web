import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, UserRole, ROLE_PERMISSIONS } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  hasMinRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for development
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'superadmin@jadtra.com',
    name: 'Super Admin',
    role: 'super_admin',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
    isActive: true,
  },
  {
    id: '2',
    email: 'admin@jadtra.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
    isActive: true,
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('jadtra-user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          loading: false,
        });
      } catch (error) {
        localStorage.removeItem('jadtra-user');
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true }));

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user in mock data
      const user = MOCK_USERS.find(
        u => u.email === credentials.email && u.isActive
      );

      if (!user) {
        throw new Error('Invalid credentials or user not found');
      }

      // In production, verify password with backend
      // For demo, we'll accept any password for mock users
      if (!credentials.password) {
        throw new Error('Password is required');
      }

      // Update last login
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString(),
      };

      // Store in localStorage
      localStorage.setItem('jadtra-user', JSON.stringify(updatedUser));

      setAuthState({
        user: updatedUser,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('jadtra-user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!authState.user) return false;

    const userPermissions = ROLE_PERMISSIONS[authState.user.role];
    const resourcePermission = userPermissions.find(p => p.resource === resource);
    
    const actions = resourcePermission?.actions ?? [];
    return actions.includes(action as any) || false;
  };

  const hasRole = (role: UserRole): boolean => {
    return authState.user?.role === role;
  };

  const hasMinRole = (requiredRole: UserRole): boolean => {
    if (!authState.user) return false;
    
    const roleHierarchy = {
      admin: 1,
      super_admin: 2,
    };
    
    return roleHierarchy[authState.user.role] >= roleHierarchy[requiredRole];
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        hasPermission,
        hasRole,
        hasMinRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
