import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/auth';
import { STORAGE_KEYS } from '../constants';

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  username: null,
  loading: true,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER_DATA: 'SET_USER_DATA'
};

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        username: action.payload.username,
        loading: false,
        error: null
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        username: null,
        user: null,
        loading: false,
        error: action.payload
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        loading: false
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case AUTH_ACTIONS.SET_USER_DATA:
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const username = localStorage.getItem(STORAGE_KEYS.USERNAME);
    
    if (token && username) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { username }
      });
    } else {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const response = await authService.login(credentials);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { username: response.data.username }
      });
      return response;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Set user data function
  const setUserData = (userData) => {
    dispatch({
      type: AUTH_ACTIONS.SET_USER_DATA,
      payload: userData
    });
  };

  const value = {
    ...state,
    login,
    logout,
    clearError,
    setUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
