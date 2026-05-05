import { useState } from 'react';
import AuthService from '../services/auth.service';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, Building, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'job_seeker' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isEmployer = formData.role === 'employer';

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AuthService.register(formData.name, formData.email, formData.password, formData.role);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to register';
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-200 border border-white/50 relative overflow-hidden transition-all duration-500 hover:shadow-indigo-300">
        
        {/* Decorative subtle background shapes */}
        <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transition-colors duration-700 ${isEmployer ? 'bg-fuchsia-500' : 'bg-indigo-500'}`}></div>
        <div className={`absolute -bottom-24 -left-24 w-48 h-48 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transition-colors duration-700 ${isEmployer ? 'bg-amber-500' : 'bg-purple-500'}`}></div>

        <div className="relative z-10">
          <div className="text-center">
            <div className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center text-white shadow-lg mb-6 transition-colors duration-500 ${isEmployer ? 'bg-gradient-to-br from-fuchsia-600 to-rose-600 shadow-fuchsia-200' : 'bg-gradient-to-br from-indigo-600 to-purple-600 shadow-indigo-200'}`}>
              {isEmployer ? <Building size={32} /> : <Briefcase size={32} />}
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isEmployer ? 'Create Employer Account' : 'Join as Job Seeker'}
            </h2>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Start your journey with JobPortal today.
            </p>
          </div>

          {error && (
            <div className="mt-4 bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 p-4 rounded-xl text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <span className="bg-red-200 text-red-700 rounded-full w-5 h-5 flex items-center justify-center text-xs">!</span>
              {error}
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleRegister}>
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <UserIcon size={20} />
                </div>
                <input type="text" required placeholder="Full Name"
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-0 text-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium placeholder:text-slate-400"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

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
                <input type="password" required placeholder="Create Password"
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-0 text-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium placeholder:text-slate-400"
                  value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-extrabold rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-lg hover:-translate-y-0.5
                ${isEmployer ? 'bg-fuchsia-600 hover:bg-fuchsia-700 focus:ring-fuchsia-500 shadow-fuchsia-200' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 shadow-indigo-200'}`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
            </button>
          </form>

          <div className="mt-8 text-center space-y-3">
            <button 
              type="button" 
              onClick={() => {
                setError('');
                setFormData({...formData, role: isEmployer ? 'job_seeker' : 'employer'});
              }}
              className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1 mx-auto underline decoration-slate-300 underline-offset-4"
            >
              {isEmployer ? 'Wait, I am actually a Job Seeker' : 'Are you an Employer? Register here'}
            </button>
            
            <p className="text-sm font-medium text-slate-500 pt-4 border-t border-slate-100">
              Already have an account?{' '}
              <Link to="/login" className="font-extrabold text-indigo-600 hover:text-indigo-500 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
