import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/authAPI';
import styles from '../styles/Register.module.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
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

    if (name === 'password' || name === 'confirmPassword') {
      const password = name === 'password' ? value : formData.password;
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      validatePassword(password, confirmPassword);
    }

    setError('');
    setSuccess('');
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

    if (!/^[a-zA-ZĄ-ż]+$/.test(formData.firstName) || formData.firstName.length < 3) {
      setError('First name must be at least 3 characters with only letters');
      return;
    }

    if (!/^[a-zA-ZĄ-ż]+$/.test(formData.lastName) || formData.lastName.length < 3) {
      setError('Last name must be at least 3 characters with only letters');
      return;
    }

    try {
      await authAPI.register(formData);
      setSuccess('Registration successful! Redirecting to login...');
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
    <div className={styles.registerContainer}>
      <div className={styles.registerPanel}>
        <h1 className={styles.registerTitle}>Security Agency</h1>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>First Name</label>
            <div className={styles.inputGroup}>
              <input
                className={styles.input}
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Last Name</label>
            <div className={styles.inputGroup}>
              <input
                className={styles.input}
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputGroup}>
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
            <div className={styles.passwordValidation}>
              <div className={`${styles.validationItem} ${passwordValidation.minLength ? styles.valid : styles.invalid}`}>
                <span className={styles.validationCheck}>
                  {passwordValidation.minLength ? '✓' : '✗'}
                </span>
                At least 8 characters
              </div>
              <div className={`${styles.validationItem} ${passwordValidation.hasUpperCase ? styles.valid : styles.invalid}`}>
                <span className={styles.validationCheck}>
                  {passwordValidation.hasUpperCase ? '✓' : '✗'}
                </span>
                One uppercase letter
              </div>
              <div className={`${styles.validationItem} ${passwordValidation.hasNumber ? styles.valid : styles.invalid}`}>
                <span className={styles.validationCheck}>
                  {passwordValidation.hasNumber ? '✓' : '✗'}
                </span>
                One digit
              </div>
              <div className={`${styles.validationItem} ${passwordValidation.hasSpecialChar ? styles.valid : styles.invalid}`}>
                <span className={styles.validationCheck}>
                  {passwordValidation.hasSpecialChar ? '✓' : '✗'}
                </span>
                One special character (!@#$%^&*)
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.inputGroup}>
              <input
                className={styles.input}
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            {formData.password && (
              <div className={`${styles.validationItem} ${passwordValidation.passwordsMatch ? styles.valid : styles.invalid}`}>
                <span className={styles.validationCheck}>
                  {passwordValidation.passwordsMatch ? '✓' : '✗'}
                </span>
                Passwords match
              </div>
            )}
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}

          <button type="submit" className={styles.button} disabled={!isPasswordValid()}>
            Register
          </button>
        </form>

        <div className={styles.linkContainer}>
          Already have an account?{' '}
          <span className={styles.link} onClick={() => navigate('/login')}>
            Login here
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
