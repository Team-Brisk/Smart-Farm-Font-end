import type { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
