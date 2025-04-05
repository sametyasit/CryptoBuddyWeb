import { createGlobalStyle } from 'styled-components';

// Tema renkleri
export const lightTheme = {
  primary: '#FFD700', // Altın
  secondary: '#000000', // Siyah
  background: '#FFFFFF',
  foreground: '#F8F9FA',
  text: '#212529',
  subText: '#6C757D',
  border: '#DEE2E6',
  success: '#28A745',
  danger: '#DC3545',
  warning: '#FFC107',
  info: '#17A2B8',
  cardBackground: '#FFFFFF',
  buttonText: '#212529',
  navBackground: '#FFFFFF',
  navText: '#212529',
  footerBackground: '#F8F9FA',
  scrollbarThumb: '#FFD700',
  scrollbarTrack: '#F0F0F0',
  chartColors: ['#FFD700', '#000000', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
};

export const darkTheme = {
  primary: '#FFD700', // Altın
  secondary: '#FFFFFF', // Beyaz (koyu temada ikincil renk olarak)
  background: '#121212',
  foreground: '#1E1E1E',
  text: '#F8F9FA',
  subText: '#ADB5BD',
  border: '#343A40',
  success: '#28A745',
  danger: '#DC3545',
  warning: '#FFC107',
  info: '#17A2B8',
  cardBackground: '#1E1E1E',
  buttonText: '#212529',
  navBackground: '#121212',
  navText: '#F8F9FA',
  footerBackground: '#121212',
  scrollbarThumb: '#FFD700',
  scrollbarTrack: '#333333',
  chartColors: ['#FFD700', '#FFFFFF', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
};

// Global stil
export const GlobalStyles = createGlobalStyle`
  :root {
    --primary: ${({ theme }) => theme === 'dark' ? darkTheme.primary : lightTheme.primary};
    --secondary: ${({ theme }) => theme === 'dark' ? darkTheme.secondary : lightTheme.secondary};
    --background: ${({ theme }) => theme === 'dark' ? darkTheme.background : lightTheme.background};
    --foreground: ${({ theme }) => theme === 'dark' ? darkTheme.foreground : lightTheme.foreground};
    --text: ${({ theme }) => theme === 'dark' ? darkTheme.text : lightTheme.text};
    --subText: ${({ theme }) => theme === 'dark' ? darkTheme.subText : lightTheme.subText};
    --border: ${({ theme }) => theme === 'dark' ? darkTheme.border : lightTheme.border};
    --success: ${({ theme }) => theme === 'dark' ? darkTheme.success : lightTheme.success};
    --danger: ${({ theme }) => theme === 'dark' ? darkTheme.danger : lightTheme.danger};
    --warning: ${({ theme }) => theme === 'dark' ? darkTheme.warning : lightTheme.warning};
    --info: ${({ theme }) => theme === 'dark' ? darkTheme.info : lightTheme.info};
    --cardBackground: ${({ theme }) => theme === 'dark' ? darkTheme.cardBackground : lightTheme.cardBackground};
    --buttonText: ${({ theme }) => theme === 'dark' ? darkTheme.buttonText : lightTheme.buttonText};
    --navBackground: ${({ theme }) => theme === 'dark' ? darkTheme.navBackground : lightTheme.navBackground};
    --navText: ${({ theme }) => theme === 'dark' ? darkTheme.navText : lightTheme.navText};
    --footerBackground: ${({ theme }) => theme === 'dark' ? darkTheme.footerBackground : lightTheme.footerBackground};
    --scrollbarThumb: ${({ theme }) => theme === 'dark' ? darkTheme.scrollbarThumb : lightTheme.scrollbarThumb};
    --scrollbarTrack: ${({ theme }) => theme === 'dark' ? darkTheme.scrollbarTrack : lightTheme.scrollbarTrack};
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--background);
    color: var(--text);
    transition: all 0.3s ease;
  }

  a {
    text-decoration: none;
    color: var(--primary);
    transition: color 0.3s ease;

    &:hover {
      color: var(--secondary);
    }
  }

  button {
    cursor: pointer;
    font-family: inherit;
    transition: all 0.3s ease;
  }

  /* Altın vurgu renkleri */
  ::selection {
    background-color: var(--primary);
    color: var(--secondary);
  }

  /* Scrollbar stilleri */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: var(--scrollbarTrack);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--scrollbarThumb);
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--primary);
  }

  /* Responsive fontlar */
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 0.8rem;
  }

  h3 {
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 0.6rem;
  }

  h4 {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 0.4rem;
  }

  p {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  /* Container */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  /* Responsive tasarım */
  @media (max-width: 992px) {
    html {
      font-size: 15px;
    }
    .container {
      max-width: 960px;
    }
  }

  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }
    .container {
      max-width: 720px;
    }
  }

  @media (max-width: 576px) {
    html {
      font-size: 13px;
    }
    .container {
      max-width: 540px;
    }
  }
`; 