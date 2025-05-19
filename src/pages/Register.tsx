import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { motion } from "framer-motion"
import { Eye, EyeOff, BookOpen, CheckCircle, AlertCircle } from "lucide-react"
import { registerUser, selectIsLoading, selectError, selectRegistrationSuccess } from "../redux/userSlice"
import { useAppDispatch, useAppSelector } from "../hooks/hook"
import "./Register.scss"

const articleCategories = [
  { id: "technology", label: "Technology" },
  { id: "science", label: "Science" },
  { id: "health", label: "Health & Wellness" },
  { id: "business", label: "Business" },
  { id: "arts", label: "Arts & Culture" },
  { id: "travel", label: "Travel" },
  { id: "food", label: "Food & Cooking" },
  { id: "sports", label: "Sports" },
  { id: "politics", label: "Politics" },
  { id: "education", label: "Education" },
  {id:'movies',label:'Movies'}
]

// Validation schema using Yup
const schema = yup.object().shape({
  firstName: yup.string().required("First name is required").min(2, "First name must be at least 2 characters"),
  lastName: yup.string().required("Last name is required").min(2, "Last name must be at least 2 characters"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, "Phone number is not valid"),
  email: yup.string().required("Email is required").email("Email must be a valid email address"),
  dob: yup
    .date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future")
    .test("age-check", "You must be at least 13 years old", (value) => {
      if (!value) return false
      const today = new Date()
      const birthDate = new Date(value)
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age >= 13
    }),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
  articlePreferences: yup
    .array()
    .min(1, "Please select at least one article preference")
    .required("Please select at least one article preference"),
})

type FormData = yup.InferType<typeof schema>

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [maxDate, setMaxDate] = useState("")
  
  // Redux selectors with correct typings
  const isLoading = useAppSelector(selectIsLoading)
  const error = useAppSelector(selectError)
  const registrationSuccess = useAppSelector(selectRegistrationSuccess)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      articlePreferences: [],
    },
  })

  // Set the max date to today when component mounts
  useEffect(() => {
    const today = new Date()
    const year = today.getFullYear()
    let month = (today.getMonth() + 1).toString()
    let day = today.getDate().toString()
    
    // Add leading zero if month or day is single digit
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    
    setMaxDate(`${year}-${month}-${day}`)
  }, [])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const onSubmit = async (data: FormData) => {
    try {
      // Exclude confirmPassword from the data sent to the server
      const { confirmPassword, ...registrationData } = data
      
      // Dispatch the registration action with only the needed data
      let response = await dispatch(registerUser(registrationData))
      
      console.log("Registration response:", response)
      // The redirect will happen when registrationSuccess becomes true
      // via the useEffect hook below
    } catch (err) {
      console.error("Registration error:", err)
    }
  }
  
  useEffect(() => {
    // Redirect to login after successful registration
    if (registrationSuccess) {
      const timer = setTimeout(() => {
        navigate("/login")
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [registrationSuccess, navigate])

  const handleLogin = () => {
    navigate("/login")
  }

  if (registrationSuccess) {
    return (
      <div className="register-container">
        <div className="success-message">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="success-icon"
          >
            <CheckCircle size={64} />
          </motion.div>
          <h2>Registration Successful!</h2>
          <p>Your account has been created successfully.</p>
          <p>Redirecting to login page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="register-container">
      <motion.div
        className="register-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="register-header">
          <div className="logo">
            <BookOpen className="logo-icon" />
            <span className="brand-name">Article_Hub</span>
          </div>
          <h1>Create Your Account</h1>
          <p>Join our community of readers and writers</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                placeholder="Enter your first name"
                {...register("firstName")}
                className={errors.firstName ? "error" : ""}
              />
              {errors.firstName && <span className="error-message">{errors.firstName.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                placeholder="Enter your last name"
                {...register("lastName")}
                className={errors.lastName ? "error" : ""}
              />
              {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                {...register("email")}
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="error-message">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                placeholder="Enter your phone number"
                {...register("phone")}
                className={errors.phone ? "error" : ""}
              />
              {errors.phone && <span className="error-message">{errors.phone.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input 
              type="date" 
              id="dob" 
              max={maxDate} 
              {...register("dob")} 
              className={errors.dob ? "error" : ""} 
            />
            {errors.dob && <span className="error-message">{errors.dob.message}</span>}
          </div>

          <div className="form-group password-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Create a password"
                {...register("password")}
                className={errors.password ? "error" : ""}
              />
              <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password.message}</span>}
          </div>

          <div className="form-group password-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "error" : ""}
              />
              <button type="button" className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
          </div>

          <div className="form-group">
            <label>Article Preferences</label>
            <p className="preference-subtitle">Select categories you're interested in (at least one)</p>
            <div className="preferences-container">
              {articleCategories.map((category) => (
                <div key={category.id} className="preference-option">
                  <input type="checkbox" id={category.id} value={category.id} {...register("articlePreferences")} />
                  <label htmlFor={category.id}>{category.label}</label>
                </div>
              ))}
            </div>
            {errors.articlePreferences && <span className="error-message">{errors.articlePreferences.message}</span>}
          </div>

          <button type="submit" className="register-btn" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
          
          {error && (
            <div className="error-alert">
              <AlertCircle size={18} />
              <span>{error.message || "An error occurred during registration"}</span>
            </div>
          )}
        </form>

        <div className="login-link">
          Already have an account?{" "}
          <button onClick={handleLogin} className="login-btn">
            Log in
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default RegisterPage
