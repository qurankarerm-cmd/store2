import { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, tokenManager } from '../utils/api';
import { toast } from 'react-toastify';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setupRequired: false,
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  SET_SETUP_REQUIRED: 'SET_SETUP_REQUIRED',
  CLEAR_AUTH: 'CLEAR_AUTH',
  UPDATE_USER: 'UPDATE_USER',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    
    case actionTypes.SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload,
        isLoading: false,
      };
    
    case actionTypes.SET_SETUP_REQUIRED:
      return {
        ...state,
        setupRequired: action.payload,
        isLoading: false,
      };
    
    case actionTypes.CLEAR_AUTH:
      return {
        ...initialState,
        isLoading: false,
      };
    
    case actionTypes.UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      // First, check if setup is required
      const setupResponse = await authAPI.checkSetup();
      
      if (setupResponse.data.setupRequired) {
        dispatch({ type: actionTypes.SET_SETUP_REQUIRED, payload: true });
        return;
      }

      // Check if we have a valid token
      if (!tokenManager.isValid()) {
        dispatch({ type: actionTypes.CLEAR_AUTH });
        return;
      }

      // Get user profile
      const userResponse = await authAPI.getProfile();
      dispatch({ type: actionTypes.SET_USER, payload: userResponse.data.user });
      
    } catch (error) {
      console.error('Auth check failed:', error);
      dispatch({ type: actionTypes.CLEAR_AUTH });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await authAPI.login(credentials);
      const { user, token } = response.data;
      
      // Store token
      tokenManager.set(token);
      
      // Set user in state
      dispatch({ type: actionTypes.SET_USER, payload: user });
      
      toast.success('تم تسجيل الدخول بنجاح');
      return { success: true };
      
    } catch (error) {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
      const message = error.message || 'فشل في تسجيل الدخول';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const setup = async (setupData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      const response = await authAPI.setup(setupData);
      const { user, token } = response.data;
      
      // Store token
      tokenManager.set(token);
      
      // Set user in state
      dispatch({ type: actionTypes.SET_USER, payload: user });
      dispatch({ type: actionTypes.SET_SETUP_REQUIRED, payload: false });
      
      toast.success('تم إعداد النظام بنجاح');
      return { success: true };
      
    } catch (error) {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
      const message = error.message || 'فشل في إعداد النظام';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear token and state regardless of API call result
      tokenManager.remove();
      dispatch({ type: actionTypes.CLEAR_AUTH });
      toast.success('تم تسجيل الخروج بنجاح');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      const updatedUser = response.data.user;
      
      dispatch({ type: actionTypes.UPDATE_USER, payload: updatedUser });
      toast.success('تم تحديث الملف الشخصي بنجاح');
      
      return { success: true, user: updatedUser };
      
    } catch (error) {
      const message = error.message || 'فشل في تحديث الملف الشخصي';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await authAPI.changePassword(passwordData);
      toast.success('تم تغيير كلمة المرور بنجاح');
      return { success: true };
      
    } catch (error) {
      const message = error.message || 'فشل في تغيير كلمة المرور';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authAPI.refreshToken();
      const { token } = response.data;
      
      tokenManager.set(token);
      return { success: true };
      
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return { success: false };
    }
  };

  const hasPermission = (resource, action) => {
    if (!state.user) return false;
    if (state.user.role === 'admin') return true;
    
    return (
      state.user.permissions?.[resource]?.[action] || false
    );
  };

  const contextValue = {
    ...state,
    login,
    setup,
    logout,
    updateProfile,
    changePassword,
    refreshToken,
    hasPermission,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// HOC for protected routes
export const withAuth = (WrappedComponent, requiredPermissions = []) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading, hasPermission } = useAuth();
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="loading-spinner w-8 h-8"></div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }
    
    // Check permissions if required
    if (requiredPermissions.length > 0) {
      const hasRequiredPermissions = requiredPermissions.every(permission => {
        const [resource, action] = permission.split(':');
        return hasPermission(resource, action);
      });
      
      if (!hasRequiredPermissions) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                غير مصرح لك بالوصول
              </h2>
              <p className="text-gray-600">
                ليس لديك الصلاحيات المطلوبة للوصول إلى هذه الصفحة.
              </p>
            </div>
          </div>
        );
      }
    }
    
    return <WrappedComponent {...props} />;
  };
};

export { AuthContext };