import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export const PrivateRoute = ({ children }) => {
  const authVar = useSelector((state: RootState) => state.auth);
  if (!authVar?.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};
