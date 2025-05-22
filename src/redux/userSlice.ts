
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../api/userApi';
import type { RootState } from './store';
import type { AuthState, LoginData, UserLoginData, UserRegistrationData } from '../entities/interface';


// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  registrationSuccess: false,
  // Add specific field errors
  fieldErrors: {
    email: null,
    phone: null,
  },
};

export const registerUser = createAsyncThunk<
  { message: string }, 
  UserRegistrationData, 
  { rejectValue: { message: string, field?: string } } 
>(
  'auth/register',
  async (userData: UserRegistrationData, { rejectWithValue }) => {
    try {
      const response = await userApi.register(userData);

      return { message: response.message || 'Registration successful' };
    } catch (error: any) {
      console.log("Registration error response:", error.response);

      const errorMessage = error.response?.data?.message || 'Email or phonenumber is already exist.';
      

      if (errorMessage.includes('User already exists')) {
        return rejectWithValue({ message: errorMessage, field: 'email' });
      } else if (errorMessage.includes('phone number already exists')) {
        return rejectWithValue({ message: errorMessage, field: 'phone' });
      }
      
      return rejectWithValue({ message: errorMessage });
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
      state.fieldErrors = {
        email: null,
        phone: null,
      };
    },
    resetRegistrationSuccess: (state) => {
      state.registrationSuccess = false;
    },
    logout: (state) => {
      // Clear user data from state
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.fieldErrors = {
        email: null,
        phone: null,
      };
      
      // Remove token from localStorage
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    // Register user cases
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.fieldErrors = {
        email: null,
        phone: null,
      };
      state.registrationSuccess = false;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.isLoading = false;
      state.registrationSuccess = true;
      // We don't set user or isAuthenticated here since user still needs to login
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = { message: action.payload?.message || 'Registration failed' };
      state.registrationSuccess = false;
      
      // Set field-specific errors if available
      if (action.payload?.field) {
        if (action.payload.field === 'email') {
          state.fieldErrors.email = action.payload.message;
        } else if (action.payload.field === 'phone') {
          state.fieldErrors.phone = action.payload.message;
        }
      }
      
      console.log("Registration rejected with payload:", action.payload);
      console.log("State after rejection:", state.error, state.fieldErrors);
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
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.fieldErrors = {
        email: null,
        phone: null,
      };
    });
  }
});

// Export actions
export const { clearError, resetRegistrationSuccess, logout } = userSlice.actions;

// Export selectors
export const selectIsLoading = (state: RootState) => state.user.isLoading;
export const selectError = (state: RootState) => state.user.error;
export const selectFieldErrors = (state: RootState) => state.user.fieldErrors;
export const selectRegistrationSuccess = (state: RootState) => state.user.registrationSuccess;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;