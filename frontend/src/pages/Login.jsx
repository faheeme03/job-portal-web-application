import { useState, useContext } from 'react';
import AuthService from '../services/auth.service';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ArrowRightCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Successfully logged in!');
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials';
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-200 border border-white/50 relative overflow-hidden hover:shadow-indigo-300 transition-all duration-500">
        
        {/* Decorative subtle background shapes */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transition-colors duration-700 bg-indigo-500"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transition-colors duration-700 bg-emerald-400"></div>

        <div className="relative z-10">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center text-white shadow-lg mb-6 transition-colors duration-500 bg-gradient-to-br from-indigo-600 to-emerald-600 shadow-indigo-200">
              <ArrowRightCircle size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Log in to access your dashboard.
            </p>
          </div>

          {error && (
            <div className="mt-4 bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 p-4 rounded-xl text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <span className="bg-red-200 text-red-700 rounded-full w-5 h-5 flex items-center justify-center text-xs">!</span>
              {error}
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Mail size={20} />
                </div>
                <input type="email" required placeholder="Email Address"
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-0 text-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium placeholder:text-slate-400"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock size={20} />
                </div>
                <input type="password" required placeholder="Password"
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-0 text-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium placeholder:text-slate-400"
                  value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-extrabold rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-lg hover:-translate-y-0.5 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 shadow-indigo-200"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
            </button>
          </form>

          <div className="mt-8 text-center space-y-3">
            <p className="text-sm font-medium text-slate-500 pt-4 border-t border-slate-100">
              Don't have an account?{' '}
              <Link to="/register" className="font-extrabold text-indigo-600 hover:text-indigo-500 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
