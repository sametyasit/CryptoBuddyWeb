import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    // Kullanıcı giriş yapmadıysa, giriş sayfasına yönlendir
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 