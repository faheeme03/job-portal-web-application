import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Building2, Users, MapPin, DollarSign, Briefcase, Zap, Star, Bookmark, Sparkles } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import SkeletonJobCard from '../components/SkeletonJobCard';
import { useBookmarks } from '../hooks/useBookmarks';
import toast from 'react-hot-toast';
export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeyword) params.append('keyword', searchKeyword);
    if (searchLocation) params.append('location', searchLocation);
    navigate(`/jobs?${params.toString()}`);
  };

  useEffect(() => {
    api.get('/jobs').then(res => {
      const fetchedJobs = res.data.content ? res.data.content : res.data;
      setJobs(fetchedJobs.slice(0, 3)); 
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleApply = (id) => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/jobs/${id}`);
    }
  };

  return (
    <div className="flex flex-col gap-20 py-12 relative overflow-hidden">
      
      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 -left-64 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-64 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Hero Section */}
      <section className="text-center px-4 relative z-10 pt-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-sm mb-8 shadow-sm">
          <Zap size={16} className="text-amber-500" fill="currentColor"/> The #1 Job Platform for Tech Professionals
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-800 tracking-tight leading-[1.1] mb-8">
          Find your dream job <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 pb-2">
            with zero hassle
          </span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 font-medium">
          Connect with top employers and discover thousands of opportunities that perfectly match your unique skills and aspirations.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto bg-white p-3 rounded-full shadow-lg border border-slate-100 mb-10 flex flex-col sm:flex-row gap-2 relative z-20">
          <div className="flex-1 flex items-center px-4 bg-slate-50 rounded-full">
            <Search className="text-slate-400 mr-2 min-w-[20px]" size={20} />
            <input 
              type="text" 
              placeholder="Job title or keyword" 
              className="w-full bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 py-3 outline-none"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <div className="flex-1 flex items-center px-4 bg-slate-50 rounded-full">
            <MapPin className="text-slate-400 mr-2 min-w-[20px]" size={20} />
            <input 
              type="text" 
              placeholder="City, state, or 'Remote'" 
              className="w-full bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 py-3 outline-none"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold transition-colors shadow-md sm:w-auto w-full flex-shrink-0"
          >
            Search
          </button>
        </form>

        <div className="flex justify-center flex-col sm:flex-row gap-4 flex-wrap mt-8">
          <Link to="/jobs" className="bg-slate-900 text-white px-10 py-5 rounded-full font-extrabold text-lg hover:bg-indigo-600 shadow-xl shadow-slate-300 hover:shadow-indigo-300 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group">
            Explore Open Jobs <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          {(!user || user.role === 'ROLE_JOB_SEEKER') && (
            <Link to="/resume-builder" target="_blank" rel="noopener noreferrer" className="bg-indigo-600 text-white px-10 py-5 rounded-full font-extrabold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-300 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group">
              <Sparkles size={20} className="text-amber-300 animate-pulse" /> Create AI Resume in Seconds <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}

          {!user && (
            <Link to="/register" className="bg-white text-slate-700 border-2 border-slate-200 px-10 py-5 rounded-full font-extrabold text-lg hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-all flex items-center justify-center gap-2">
              Create an Account
            </Link>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-8 max-w-5xl mx-auto w-full relative z-10">
        <div className="flex flex-col items-center gap-4 text-center group">
          <div className="bg-blue-50 p-5 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm"><Search size={36} strokeWidth={2}/></div>
          <div>
            <h3 className="text-4xl font-extrabold text-slate-800 mb-1">10k+</h3>
            <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">Active Jobs</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 text-center group border-t md:border-t-0 md:border-l border-slate-100 pt-8 md:pt-0">
          <div className="bg-purple-50 p-5 rounded-2xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shadow-sm"><Building2 size={36} strokeWidth={2}/></div>
          <div>
            <h3 className="text-4xl font-extrabold text-slate-800 mb-1">500+</h3>
            <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">Companies</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 text-center group border-t md:border-t-0 md:border-l border-slate-100 pt-8 md:pt-0">
          <div className="bg-emerald-50 p-5 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm"><Users size={36} strokeWidth={2}/></div>
          <div>
            <h3 className="text-4xl font-extrabold text-slate-800 mb-1">50k+</h3>
            <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">Job Seekers</p>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-6xl mx-auto w-full px-4 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider border-b border-indigo-200 pb-2 mb-3 max-w-fit">
              <Star size={18} fill="currentColor"/> Top Opportunities
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800">Featured Jobs</h2>
          </div>
          <Link to="/jobs" className="text-indigo-600 font-extrabold hover:text-indigo-800 transition-colors flex items-center gap-2 bg-indigo-50 px-5 py-2.5 rounded-full hover:bg-indigo-100">
            View All Jobs <ArrowRight size={18} />
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3].map(i => <SkeletonJobCard key={i} />)
          ) : (
            jobs.map(job => {
              const saved = isBookmarked(job.id);
              return (
              <div key={job.id} className="bg-white/80 backdrop-blur-lg p-5 sm:p-8 border border-white/50 rounded-[2rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-2xl flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:shadow-indigo-100 hover:-translate-y-2">
                <button 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    toggleBookmark(job.id); 
                    toast.success(saved ? "Removed from saved" : "Job saved successfully"); 
                  }}
                  className={`absolute top-6 right-6 p-2 rounded-full transition-colors z-20 ${saved ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-500'}`}
                  title={saved ? "Remove bookmark" : "Save job"}
                >
                  <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
                </button>
                    
                <div className="flex-1">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-6 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <Briefcase size={28} strokeWidth={1.5}/>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-800 mb-3 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors pr-10">{job.title}</h3>
                  
                  <div className="flex flex-col gap-3 mt-6 mb-8 text-sm font-semibold text-slate-500">
                    <span className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl"><Building2 size={18} className="text-slate-400"/> {job.company}</span>
                    <span className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl"><MapPin size={18} className="text-slate-400"/> {job.location}</span>
                    <span className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-xl border border-emerald-100/50"><DollarSign size={18} className="text-emerald-500"/> ${job.salary.toLocaleString()}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleApply(job.id)}
                  className="w-full bg-slate-900 text-white group-hover:bg-indigo-600 py-4 px-6 rounded-xl font-extrabold transition-colors duration-300 shadow-md flex items-center justify-center gap-2 mt-auto"
                >
                  Apply Now <ArrowRight size={18} />
                </button>
              </div>
            )})
          )}
          {!loading && jobs.length === 0 && (
            <div className="col-span-3 bg-white/60 backdrop-blur-xl border border-white/50 p-16 rounded-[2.5rem] text-center shadow-sm">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                <Briefcase size={32}/>
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-2">No active jobs found</h3>
              <p className="text-slate-500">Employers are getting ready to post new opportunities. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
