import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import "./Login.scss";
import { loginUser, selectIsLoading, selectError, selectIsAuthenticated, clearError } from "../redux/userSlice";
import type { AppDispatch } from "../redux/store";

interface FormValues {
  identifier: string;
  password: string;
}

interface FormErrors {
  identifier?: string;
  password?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [values, setValues] = useState<FormValues>({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [clientSideSubmitting, setClientSideSubmitting] = useState(false);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard"); // Redirect to dashboard or home page when authenticated
    }
  }, [isAuthenticated, navigate]);

  // Clear previous errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Define validation schema using Yup
  const loginSchema = yup.object().shape({
    identifier: yup
      .string()
      .required("Email or phone number is required")
      .test("is-valid", "Please enter a valid email or phone number", (value) => {
        if (!value) return false;
        // Check if it's a valid email
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        // Check if it's a valid phone number (basic validation)
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        
        return emailRegex.test(value) || phoneRegex.test(value);
      }),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    
    // Clear specific field error when the user starts typing again
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
    
    // Clear Redux error when the user makes changes
    if (error) {
      dispatch(clearError());
    }
  };

  const validateForm = async () => {
    try {
      await loginSchema.validate(values, { abortEarly: false });
      return {};
    } catch (yupError) {
      if (yupError instanceof yup.ValidationError) {
        const validationErrors: FormErrors = {};
        yupError.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path as keyof FormErrors] = error.message;
          }
        });
        return validationErrors;
      }
      return {};
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientSideSubmitting(true);
    
    const validationErrors = await validateForm();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      // Dispatch login action to Redux
      try {
        const result = await dispatch(loginUser(values)).unwrap();
        // Success handling is done by the useEffect that watches isAuthenticated
        console.log("Login successful:", result);
      } catch (err) {
        // Error is handled by the Redux state
        console.error("Login failed:", err);
      } finally {
        setClientSideSubmitting(false);
      }
    } else {
      setClientSideSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-banner">
              {error.message}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="identifier">Email or Phone Number</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={values.identifier}
              onChange={handleChange}
              placeholder="Enter your email or phone number"
              className={errors.identifier ? "error" : ""}
              disabled={isLoading}
            />
            {errors.identifier && <p className="error-message">{errors.identifier}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={errors.password ? "error" : ""}
              disabled={isLoading}
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="login-button" 
              disabled={isLoading || clientSideSubmitting}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
          
          <div className="additional-options">
            <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
            <p className="signup-prompt">
              Don't have an account? <a href="/signup">Sign up</a>
            </p>
          </div>
        </form>
        
        <button 
          onClick={() => navigate("/")} 
          className="back-button"
          disabled={isLoading}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Login;

