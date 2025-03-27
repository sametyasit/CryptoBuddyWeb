import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    /* Light Theme */
    &[data-theme='light'] {
      --primary: #FFD700;
      --primary-dark: #FFA500;
      --secondary: #FFFFFF;
      --background: #F8F9FA;
      --text: #1A1A1A;
      --subText: #666666;
      --border: #E0E0E0;
      --cardBackground: #FFFFFF;
      --card-hover: #F5F5F5;
      --success: #28A745;
      --danger: #DC3545;
      --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    /* Dark Theme */
    &[data-theme='dark'] {
      --primary: #FFD700;
      --primary-dark: #FFA500;
      --secondary: #1A1A1A;
      --background: #121212;
      --text: #FFFFFF;
      --subText: #B0B0B0;
      --border: #2D2D2D;
      --cardBackground: #1E1E1E;
      --card-hover: #2A2A2A;
      --success: #28A745;
      --danger: #DC3545;
      --shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--background);
    color: var(--text);
    line-height: 1.6;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    border: none;
    outline: none;
    background: none;
    font-family: inherit;
    cursor: pointer;
  }

  input, textarea {
    font-family: inherit;
    background-color: var(--cardBackground);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 0.75rem 1rem;
    border-radius: 4px;
    transition: all 0.3s ease;

    &:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
      outline: none;
    }

    &::placeholder {
      color: var(--subText);
    }
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  p {
    margin-bottom: 1rem;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  /* Scrollbar Styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--background);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--primary-dark);
  }

  /* Transitions */
  a, button {
    transition: all 0.3s ease;
  }

  /* Selection */
  ::selection {
    background: var(--primary);
    color: var(--secondary);
  }

  /* Form elementleri için varsayılan stiller */
  input, textarea, select {
    background-color: var(--foreground);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.75rem 1rem;
    color: var(--text);
    font-size: 1rem;
    width: 100%;
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
    }
    
    &::placeholder {
      color: var(--subText);
    }
  }

  /* Butonlar için varsayılan stiller */
  button {
    background-color: var(--primary);
    color: var(--secondary);
    border: none;
    border-radius: 4px;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }

  /* Ana içerik alanı için stil */
  main {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;
    padding-top: 60px; /* Navbar için alan */
  }
`;

export default GlobalStyle; 