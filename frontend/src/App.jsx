import { Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import EmailVerificationPage from "./Pages/EmailVerificationPage";
import DashboardPage from "./Pages/DashboardPage";
import { useAuthStore } from "./store/authStore";
import { Toaster } from 'react-hot-toast';

export default function App() { 
  // protect routes that require authentication
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	if (!user.isVerified) {
		return <Navigate to='/verify-email' replace />;
	}

	return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.isVerified) {
		return <Navigate to='/' replace />;
	}

	return children;
};

  
  return( 
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-green-800 to-emerald-800 flex items-center justify-center relative overflow-hidden">
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5}  />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2}  />
      <Routes>
        <Route path="/" element={<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>}/>
        <Route path="/signup" element={<ProtectedRoute>
							<SignupPage/>
						</ProtectedRoute>}/>
        <Route path="/login" element={<ProtectedRoute>
							<LoginPage/>
						</ProtectedRoute>}/>
        <Route path="/verify-email" element={<EmailVerificationPage/>}/>



      </Routes>
      <Toaster />

    </div>
  );
 }