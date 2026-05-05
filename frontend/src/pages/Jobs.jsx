import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { MapPin, DollarSign, Building, Sparkles, Filter, Search, Bookmark } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import SkeletonJobCard from '../components/SkeletonJobCard';
import { useBookmarks } from '../hooks/useBookmarks';
import toast from 'react-hot-toast';

export default function Jobs() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  
  const initialKeyword = searchParams.get('keyword') || '';
  const initialLocation = searchParams.get('location') || '';

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(searchParams.get('page') ? parseInt(searchParams.get('page')) : 0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [searchFilters, setSearchFilters] = useState({
    keyword: initialKeyword, location: initialLocation, minSalary: '', maxSalary: '', experienceLevel: '', jobType: '', skill: ''
  });

  const performSearch = async (params, page = 0) => {
    setLoading(true);
    try {
      params.page = page;
      const res = await api.get('/jobs/search', { params });
      setFilteredJobs(res.data.content ? res.data.content : res.data);
      setTotalPages(res.data.totalPages || 1);
      setTotalElements(res.data.totalElements || (res.data.content ? res.data.content.length : res.data.length) || 0);
      setCurrentPage(page);
      
      const newParams = { ...params };
      if (page > 0) newParams.page = page;
      setSearchParams(newParams, { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialKeyword && !initialLocation) {
      api.get(`/jobs?page=${currentPage}`).then(res => {
        setJobs(res.data.content ? res.data.content : res.data);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || (res.data.content ? res.data.content.length : res.data.length) || 0);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    } else {
      const params = {};
      if (initialKeyword) params.keyword = initialKeyword;
      if (initialLocation) params.location = initialLocation;
      performSearch(params, currentPage);
    }
  }, []);

  useEffect(() => {
    if (jobs.length > 0 && location.state?.matchedJobIds) {
      const { matchedJobIds } = location.state;
      if (!matchedJobIds || matchedJobIds.length === 0) {
        setFilteredJobs([]);
      } else {
        const filtered = jobs.filter(j => matchedJobIds.includes(j.id));
        setFilteredJobs(filtered);
      }
    }
  }, [location.state, jobs]);

  const handleSearch = (e) => {
    e?.preventDefault();
    const params = Object.fromEntries(Object.entries(searchFilters).filter(([_, v]) => v !== ''));
    performSearch(params, 0); // Reset to page 0 on new search
  };

  const handlePageChange = (newPage) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (filteredJobs !== null) {
      const params = Object.fromEntries(Object.entries(searchFilters).filter(([_, v]) => v !== ''));
      performSearch(params, newPage);
    } else {
      setLoading(true);
      api.get(`/jobs?page=${newPage}`).then(res => {
        setJobs(res.data.content ? res.data.content : res.data);
        setTotalPages(res.data.totalPages || 1);
        setCurrentPage(newPage);
        setSearchParams(newPage > 0 ? { page: newPage } : {});
        setLoading(false);
      });
    }
  };

  const handleClearFilter = () => {
    setFilteredJobs(null);
    setSearchFilters({
      keyword: '', location: '', minSalary: '', maxSalary: '', experienceLevel: '', jobType: '', skill: ''
    });
    setSearchParams({});
  };

  const displayJobs = filteredJobs !== null ? filteredJobs : jobs;

  return (
    <div className="py-8 max-w-5xl mx-auto relative min-h-[80vh]">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Latest Opportunities</h2>
          {displayJobs.length > 0 && (
             <p className="text-slate-500 font-medium">Showing {displayJobs.length} of {totalElements} opportunities</p>
          )}
          {filteredJobs !== null && (
            <div className="flex items-center gap-3 mt-3">
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-500" /> Filter Active
              </span>
              <button 
                onClick={handleClearFilter} 
                className="text-sm text-gray-500 hover:text-red-500 transition-colors font-bold underline"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Search Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8 animate-in fade-in slide-in-from-top-4">
        <div className="flex items-center gap-2 mb-4 text-indigo-700 font-bold">
          <Filter size={18} /> Advanced Search
        </div>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          <input type="text" placeholder="Job Title or Keyword" className="bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 p-3 rounded-xl text-sm transition-all" value={searchFilters.keyword} onChange={e => setSearchFilters({...searchFilters, keyword: e.target.value})} />
          <input type="text" placeholder="Location" className="bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 p-3 rounded-xl text-sm transition-all" value={searchFilters.location} onChange={e => setSearchFilters({...searchFilters, location: e.target.value})} />
          <input type="number" placeholder="Min Salary" className="bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 p-3 rounded-xl text-sm transition-all" value={searchFilters.minSalary} onChange={e => setSearchFilters({...searchFilters, minSalary: e.target.value})} />
          <input type="number" placeholder="Max Salary" className="bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 p-3 rounded-xl text-sm transition-all" value={searchFilters.maxSalary} onChange={e => setSearchFilters({...searchFilters, maxSalary: e.target.value})} />
          
          <select className="bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 p-3 rounded-xl text-sm transition-all text-slate-600" value={searchFilters.experienceLevel} onChange={e => setSearchFilters({...searchFilters, experienceLevel: e.target.value})}>
            <option value="">Any Experience</option>
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
          </select>
          
          <select className="bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 p-3 rounded-xl text-sm transition-all text-slate-600" value={searchFilters.jobType} onChange={e => setSearchFilters({...searchFilters, jobType: e.target.value})}>
            <option value="">Any Job Type</option>
            <option value="Onsite">Onsite</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
          </select>
          
          <input type="text" placeholder="Skills (e.g. React)" className="bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 p-3 rounded-xl text-sm transition-all" value={searchFilters.skill} onChange={e => setSearchFilters({...searchFilters, skill: e.target.value})} />
          
          <div className="lg:col-span-7 flex justify-end mt-2">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2">
              <Search size={18} /> Search Jobs
            </button>
          </div>
        </form>
      </div>

      <div className="grid gap-6">
        {loading ? (
          [1, 2, 3, 4, 5].map(i => <SkeletonJobCard key={i} />)
        ) : displayJobs.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border text-gray-500 shadow-sm">
            {filteredJobs !== null ? "No jobs matched your criteria. Try a different search." : "No jobs available right now."}
          </div>
        ) : (
          displayJobs.map(job => {
            const saved = isBookmarked(job.id);
            return (
            <div key={job.id} className="bg-white p-6 border rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:justify-between md:items-center gap-4 relative md:pr-16">
              <button 
                onClick={(e) => { 
                  e.preventDefault(); 
                  toggleBookmark(job.id); 
                  toast.success(saved ? "Removed from saved" : "Job saved successfully"); 
                }}
                className={`absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full transition-colors ${saved ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-500'}`}
                title={saved ? "Remove bookmark" : "Save job"}
              >
                <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
              </button>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><Building size={16}/> {job.company}</span>
                  <span className="flex items-center gap-1"><MapPin size={16}/> {job.location}</span>
                  <span className="flex items-center gap-1"><DollarSign size={16}/> ${job.salary.toLocaleString()}</span>
                  {job.experienceLevel && <span className="flex items-center gap-1 font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{job.experienceLevel}</span>}
                  {job.jobType && <span className="flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{job.jobType}</span>}
                  {job.skills && <span className="flex items-center gap-1 text-slate-500 text-xs mt-1 border border-slate-200 px-2 py-0.5 rounded-md">{job.skills}</span>}
                </div>
              </div>
              <Link to={`/jobs/${job.id}`} className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-6 py-3 rounded-xl font-semibold transition-colors whitespace-nowrap text-center mt-4 md:mt-0 w-full md:w-auto">
                View Details
              </Link>
            </div>
          )})
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-12 animate-in fade-in slide-in-from-bottom-4">
          <button 
            disabled={currentPage === 0}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-6 py-2.5 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-indigo-300 disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-slate-200 transition-all shadow-sm"
          >
            Previous
          </button>
          <span className="text-slate-500 font-bold bg-slate-100 px-4 py-2 rounded-lg">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button 
            disabled={currentPage >= totalPages - 1}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 border-2 border-indigo-600 text-white font-bold hover:bg-indigo-700 hover:border-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 disabled:hover:border-indigo-600 transition-all shadow-md mt-0"
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
}
