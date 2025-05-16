import React, { useState, useEffect } from 'react';
import axios from 'axios';
import userApi from '../api/userApi';
import { FiUser, FiMail, FiPhone, FiCalendar, FiKey, FiCheck, FiX, FiEdit } from 'react-icons/fi';
import './Profile.scss';
import { useSelector } from 'react-redux';
import type { ReduxData } from '../entities/interface';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: Date | string;
  articlePreferences: string[];
  createdAt: Date | string;
}

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Article preferences options
const articlePreferenceOptions = [
  'Technology', 'Business', 'Science', 'Health',
  'Politics', 'Sports', 'Entertainment', 'Travel',
  'Food', 'Fashion', 'Art', 'Environment'
];

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [passwordData, setPasswordData] = useState<PasswordChange>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning';
  }>({
    show: false,
    message: '',
    type: 'success'
  });
  const userId = useSelector((state: ReduxData) => state.user.user.id);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      const response = await userApi.getProfile(userId);
      console.log(response, 'the response is coming as like this');
      
      // The response is already the user object directly
      // No need to access nested properties
      const userProfile = response;
      
      if (!userProfile || !userProfile._id) {
        throw new Error('User profile data not found in response');
      }
      
      setUser(userProfile);
      setFormData(userProfile);
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile data');
      setLoading(false);
      console.error(err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePreferenceChange = (preference: string) => {
    const currentPreferences = formData.articlePreferences || [];
    
    if (currentPreferences.includes(preference)) {
      setFormData({
        ...formData,
        articlePreferences: currentPreferences.filter(p => p !== preference)
      });
    } else {
      setFormData({
        ...formData,
        articlePreferences: [...currentPreferences, preference]
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const showAlert = (message: string, type: 'success' | 'error' | 'warning') => {
    setAlert({
      show: true,
      message,
      type
    });

    setTimeout(() => {
      setAlert({ show: false, message: '', type: 'success' });
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
    let userDetails: Partial<User> = formData
    const response = await userApi.updateProfile(userDetails)
      
      setUser(response.data);
      setEditMode(false);
      showAlert('Profile updated successfully!', 'success');
    } catch (err) {
      showAlert('Failed to update profile', 'error');
      console.error(err);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    
    try {
     let currentPassword = passwordData.currentPassword;
     let newPassword = passwordData.newPassword
       let result = await userApi.changePassword(currentPassword,newPassword,userId)
       console.log(result)
      
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      showAlert('Password changed successfully!', 'success');
    } catch (err) {
      let errorMsg = 'Failed to change password';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      setPasswordError(errorMsg);
      console.error(err);
    }
  };

  const formatDate = (dateString: Date | string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD for input
  };

  if (loading) {
    return (
      <div className="profile-container loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container error">
        <div className="error-message">{error}</div>
        <button className="btn-primary" onClick={fetchUserProfile}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {alert.show && (
        <div className={`alert alert-${alert.type}`}>
          <span className="alert-message">{alert.message}</span>
          <button className="alert-close" onClick={() => setAlert({ ...alert, show: false })}>
            <FiX />
          </button>
        </div>
      )}
      
      <div className="profile-header">
        <h1 className="page-title">My Profile</h1>
        <div className="action-buttons">
          {!editMode ? (
            <button 
              className="edit-profile-btn" 
              onClick={() => setEditMode(true)}
            >
              <FiEdit /> Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                className="cancel-btn" 
                onClick={() => {
                  setEditMode(false);
                  setFormData(user || {});
                }}
              >
                <FiX /> Cancel
              </button>
              <button 
                className="save-btn" 
                onClick={handleSubmit}
              >
                <FiCheck /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section personal-info">
          <h2 className="section-title">Personal Information</h2>
          
          <form className="profile-form">
            <div className="form-group">
              <label htmlFor="firstName">
                <FiUser /> First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName || ''}
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">
                <FiUser /> Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">
                <FiMail /> Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">
                <FiPhone /> Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dob">
                <FiCalendar /> Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob ? formatDate(formData.dob) : ''}
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </div>
            
            <div className="form-group password-section">
              <label>
                <FiKey /> Password
              </label>
              <div className="password-field">
                <input
                  type="password"
                  value="••••••••"
                  disabled
                />
                <button 
                  type="button" 
                  className="change-password-btn"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change Password
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <div className="profile-section preferences">
          <h2 className="section-title">Article Preferences</h2>
          <div className="preferences-container">
            {articlePreferenceOptions.map(preference => (
              <div className="preference-item" key={preference}>
                <label className={`preference-label ${(formData.articlePreferences || []).includes(preference) ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    checked={(formData.articlePreferences || []).includes(preference)}
                    onChange={() => editMode && handlePreferenceChange(preference)}
                    disabled={!editMode}
                  />
                  <span className="preference-text">{preference}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="profile-section account-info">
          <h2 className="section-title">Account Information</h2>
          <div className="account-details">
            <div className="detail-item">
              <span className="detail-label">Member Since</span>
              <span className="detail-value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="modal-backdrop">
          <div className="password-modal">
            <div className="modal-header">
              <h3>Change Password</h3>
              <button className="close-modal" onClick={() => setShowPasswordModal(false)}>
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handlePasswordSubmit}>
              {passwordError && (
                <div className="password-error">
                  {passwordError}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;