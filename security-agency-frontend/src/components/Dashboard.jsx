import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/Dashboard.module.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardPanel}>
        <div className={styles.greeting}>
          Hello {user.firstName} {user.lastName}
        </div>

        <div className={styles.userInfo}>
          <div>
            <div className={styles.infoLabel}>Email</div>
            <div className={styles.infoValue}>{user.email}</div>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button className={`${styles.button} ${styles.logoutButton}`} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
