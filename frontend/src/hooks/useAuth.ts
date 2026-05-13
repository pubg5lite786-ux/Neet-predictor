import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { loginSuccess, loginFailure, logout, setLoading } from '../store/slices/authSlice';
import api from '../utils/api';
import { API_ENDPOINTS } from '../config';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn, token, user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
      dispatch(loginSuccess(response.data));
      return true;
    } catch (err: any) {
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post(API_ENDPOINTS.AUTH.SIGNUP, {
        name,
        email,
        password,
      });
      dispatch(loginSuccess(response.data));
      return true;
    } catch (err: any) {
      dispatch(loginFailure(err.response?.data?.message || 'Signup failed'));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    isLoggedIn,
    token,
    user,
    loading,
    error,
    login,
    signup,
    logout: handleLogout,
  };
};
