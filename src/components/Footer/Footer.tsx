import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        Made by{' '}
        <a 
          href="https://github.com/onbao165" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.link}
        >
          Barooon165
        </a>
      </p>
    </footer>
  );
}; 