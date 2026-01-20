import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom"; // ✅ Import Navigate, not useNavigate
import axiosInstance from "../api/axiosInstance";
import Spinner from "../components/ui/Loading";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // ✅ null = loading

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axiosInstance.get('/users/me');
        setIsAuthenticated(response.status === 200);
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsAuthenticated(false);
      }
    };
    
    checkUser();
  }, []);

  // console.log('isAuthenticated:', isAuthenticated);

  // ✅ Still checking auth
  if (isAuthenticated === null) {
    return (
      <Spinner />
    );
  }

  // ✅ Not authenticated - redirect using Navigate component
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ✅ Authenticated - render children
  return <>{children}</>;
};

export default ProtectedRoutes;