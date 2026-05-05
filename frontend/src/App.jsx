import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobDetails from './pages/JobDetails';
import Jobs from './pages/Jobs';
import DashboardRouting from './pages/DashboardRouting';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Chatbot from './components/Chatbot';
import ResumeBuilder from './pages/ResumeBuilder';

import { useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />; // Unauthorized
  }

  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
        <Navbar />
        <Toaster position="bottom-right" toastOptions={{ style: { borderRadius: '12px', background: '#333', color: '#fff' } }} />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/resume-builder" element={
              <PrivateRoute roles={['ROLE_JOB_SEEKER']}>
                <ResumeBuilder />
              </PrivateRoute>
            } />
            
            <Route path="/dashboard/*" element={
              <PrivateRoute>
                <DashboardRouting />
              </PrivateRoute>
            } />
          </Routes>
        </main>
        {user && <Chatbot />}
        <footer className="bg-white border-t py-8 text-center text-gray-500 text-sm font-medium shadow-inner">
          <p>© 2026 Job Portal. Designed for Excellence.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
