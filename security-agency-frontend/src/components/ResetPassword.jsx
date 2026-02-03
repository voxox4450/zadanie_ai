import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/authAPI';
import styles from '../styles/ResetPassword.module.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    passwordsMatch: false,
  });

  const validatePassword = (password, confirmPassword) => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password),
      passwordsMatch: password === confirmPassword && password !== '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'newPassword' || name === 'confirmPassword') {
      const newPassword = name === 'newPassword' ? value : formData.newPassword;
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      validatePassword(newPassword, confirmPassword);
    }

    setError('');
  };

  const isPasswordValid = () => {
    return Object.values(passwordValidation).every(val => val === true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid()) {
      setError('Password requirements not met');
      return;
    }

    try {
      await authAPI.resetPassword(formData);
      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        setError(errorData.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className={styles.resetContainer}>
      <div className={styles.resetPanel}>
        <h1 className={styles.resetTitle}>Reset Password</h1>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputGroup}>
              <span className={styles.icon}>✉️</span>
              <input
                className={styles.input}
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>New Password</label>
            <div className={styles.inputGroup}>
              <span className={styles.icon}>🔐</span>
              <input
                className={styles.input}
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.inputGroup}>
              <span className={styles.icon}>🔐</span>
              <input
                className={styles.input}
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}

          <button type="submit" className={styles.button} disabled={!isPasswordValid()}>
            Reset Password
          </button>
        </form>

        <div className={styles.linkContainer}>
          Remember your password?{' '}
          <span className={styles.link} onClick={() => navigate('/login')}>
            Login here
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
