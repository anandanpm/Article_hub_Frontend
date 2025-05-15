


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../api/userApi';
import type { RootState } from './store';
import type { AuthState, LoginData, UserLoginData, UserRegistrationData, UserState } from '../entities/interface';

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  registrationSuccess: false,
};

export const registerUser = createAsyncThunk<
  UserState, 
  UserRegistrationData, 
  { rejectValue: { message: string } } 
>(
  'auth/register',
  async (userData: UserRegistrationData, { rejectWithValue }) => {
    try {
      const response = await userApi.register(userData);
      return response; 
    } catch (error: any) {
      return rejectWithValue({ 
        message: error.response?.data?.message || 'Registration failed'
      });
    }
  }
);

export const loginUser = createAsyncThunk<
  LoginData,                
  UserLoginData,            
  { rejectValue: { message: string } }
>(
  'auth/login',
  async (values: UserLoginData, { rejectWithValue }) => {
    try {
      const response = await userApi.login(values);
      
      return response as LoginData;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Email or password is incorrect',
      });
    }
  }
);

// Added logout thunk for API call if needed
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      
       await userApi.logoutUser();
      return true;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Logout failed',
      });
    }
  }
);

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetRegistrationSuccess: (state) => {
      state.registrationSuccess = false;
    },
    logout: (state) => {
      // Clear user data from state
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      
      // Remove token from localStorage
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    // Register user cases
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.registrationSuccess = false;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.isLoading = false;
      state.registrationSuccess = true;
      // Optionally store the user data if needed
      // state.user = action.payload;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || { message: 'Registration failed' };
    });
    
    // Login user cases
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user; 
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload || { message: 'Login failed' };
    });
    
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    });
  }
});

// Export actions
export const { clearError, resetRegistrationSuccess, logout } = userSlice.actions;

// Export selectors
export const selectIsLoading = (state: RootState) => state.user.isLoading;
export const selectError = (state: RootState) => state.user.error;
export const selectRegistrationSuccess = (state: RootState) => state.user.registrationSuccess;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;