import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/authAPI';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/Login.module.css';

const Login = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [accountLocked, setAccountLocked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (accountLocked) {
      setError('Your account is locked. Please reset your password.');
      navigate('/reset-password');
      return;
    }

    try {
      const response = await authAPI.login(formData);
      login(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        setFailedAttempts(errorData.failedAttempts || 0);
        if (errorData.accountLocked) {
          setAccountLocked(true);
          setError(errorData.message);
          setTimeout(() => {
            navigate('/reset-password');
          }, 2000);
        } else {
          setError(errorData.message);
        }
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginPanel}>
        <h1 className={styles.loginTitle}>Security Agency</h1>
        
        {accountLocked && (
          <div className={styles.attemptsWarning}>
            Account locked. Redirecting to password reset...
          </div>
        )}
        
        {failedAttempts > 0 && !accountLocked && (
          <div className={styles.attemptsWarning}>
            Failed attempts: {failedAttempts} of 3
          </div>
        )}
        
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
            <label className={styles.label}>Password</label>
            <div className={styles.inputGroup}>
              <span className={styles.icon}>🔐</span>
              <input
                className={styles.input}
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>

        <div className={styles.linkContainer}>
          Don't have an account?{' '}
          <span className={styles.link} onClick={() => navigate('/register')}>
            Register here
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
