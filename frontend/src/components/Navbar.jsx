import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, User, LogOut, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Briefcase size={24} strokeWidth={2.5} />
            </div>
            <Link to={user ? "/dashboard" : "/"} className="text-2xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              JobPortal
            </Link>
          </div>
          <div className="flex gap-8 items-center font-semibold text-slate-600">
            {(!user || user.role !== 'ROLE_EMPLOYER') && (
              <Link to="/jobs" className="hover:text-indigo-600 transition-colors hidden sm:block">Explore Jobs</Link>
            )}
            
            {user ? (
              <div className="flex items-center gap-5 ml-2">
                <Link to="/dashboard" className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
                  <div className="bg-slate-100 p-2 rounded-full"><User size={18} /></div>
                  <span className="hidden sm:block">Dashboard</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors text-sm font-bold"
                >
                  <LogOut size={18} /> <span className="hidden sm:block">Logout</span>
                </button>
              </div>
            ) : (!isAuthPage && (
              <div className="flex items-center gap-4 ml-2">
                <Link to="/login" className="hover:text-amber-600 transition-colors">Log In</Link>
                <Link to="/register" className="bg-slate-900 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-full shadow-md hover:shadow-xl hover:shadow-indigo-200 transition-all text-sm flex items-center gap-2 transform hover:-translate-y-0.5">
                  <Sparkles size={16} /> Sign Up
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
