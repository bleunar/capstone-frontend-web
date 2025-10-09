import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingPage from './LoadingPage';

// guard component that requires authentication, redirects to login if not authenticated

export default function RequireAuth({ children }) {
  const { authenticated, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <LoadingPage />;
  }

  if (!authenticated) {
    // Redirect to login page with return url
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
