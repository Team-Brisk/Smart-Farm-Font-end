import { FC } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ element }) => {
  const token = localStorage.getItem('token'); // หรือจาก Redux, Context

  if (!token) {
    return <Navigate to="/login" replace />; // ถ้าไม่ login → redirect ไป login
  }

  return element;
};

export default ProtectedRoute;
