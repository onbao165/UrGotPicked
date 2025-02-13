import { NavLink } from 'react-router-dom';
import { routes } from '../../configs/routes';
import styles from './Navbar.module.css';

export const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div>
            <span className={styles.logo}>
              UrGotPicked
            </span>
          </div>
          
          <div className={styles.navLinks}>
            {routes.map((route) => (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) => 
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                {route.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}; 