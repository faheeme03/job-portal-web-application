import { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { MapPin, DollarSign, Building2, ArrowLeft, Upload, Briefcase, FileText, CheckCircle } from 'lucide-react';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState('');
  const [applying, setApplying] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    api.get(`/jobs/${id}`).then(res => {
      setJob(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) {
      setMessage("Please select a resume file first."); return;
    }
    setApplying(true);
    setMessage('');
    
    const formData = new FormData();
    formData.append('jobId', job.id);
    formData.append('resume', resume);

    try {
      const res = await api.post('/applications/apply', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(res.data.message || 'Application submitted successfully!');
      setResume(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error applying for job.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-32">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
  
  if (!job) return (
    <div className="text-center py-20">
      <div className="bg-red-50 text-red-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"><Briefcase size={32}/></div>
      <h2 className="text-2xl font-bold text-slate-800">Job Not Found</h2>
      <p className="text-slate-500 mt-2">The job you are looking for does not exist or has been removed.</p>
    </div>
  );

  const isSuccess = message && !message.toLowerCase().includes('error') && !message.toLowerCase().includes('please');

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 mb-8 transition-colors group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Jobs List
      </button>

      {/* Main Job Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-[100%] -z-10"></div>
        
        <div className="flex items-start gap-6 mb-8">
          <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 flex-shrink-0 shadow-sm">
            <Building2 size={36} strokeWidth={1.5}/>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2 leading-tight">{job.title}</h1>
            <p className="text-xl text-slate-500 font-medium">{job.company}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-600 mb-10 border-y border-slate-100 py-6">
          <span className="flex items-center gap-2 bg-slate-50 px-5 py-3 rounded-xl"><MapPin size={20} className="text-slate-400"/> {job.location}</span>
          <span className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-3 rounded-xl border border-emerald-100/50"><DollarSign size={20} className="text-emerald-500"/> ${job.salary.toLocaleString()} / year</span>
        </div>

        <div className="prose max-w-none text-slate-700">
          <h3 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2"><FileText size={20} className="text-indigo-500"/> Job Description</h3>
          <p className="whitespace-pre-wrap leading-relaxed font-medium">{job.description}</p>
        </div>
      </div>

      {/* Application Section */}
      {user?.role === 'ROLE_JOB_SEEKER' && (
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2.5rem] p-10 shadow-xl shadow-indigo-200 relative overflow-hidden text-white">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-extrabold mb-2">Apply for this role</h3>
            <p className="text-indigo-200 mb-8 font-medium">Submit your resume to be considered for this position.</p>
            
            {message && (
              <div className={`mb-8 p-4 rounded-xl text-sm font-bold flex items-center gap-3 animate-in fade-in
                ${isSuccess ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-100 border border-rose-500/30'}`}>
                {isSuccess ? <CheckCircle size={20} className="text-emerald-400" /> : <div className="bg-rose-400 text-rose-900 rounded-full w-5 h-5 flex items-center justify-center text-xs">!</div>}
                {message}
              </div>
            )}
            
            <form onSubmit={handleApply} className="flex flex-col gap-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-400/50 hover:border-indigo-300 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer backdrop-blur-sm"
              >
                <div className="bg-indigo-500/20 p-4 rounded-full shadow-sm text-indigo-300">
                  <Upload size={32} />
                </div>
                <div className="text-center">
                  <p className="text-white font-bold mb-1 text-lg">
                    {resume ? resume.name : 'Click to select your Resume'}
                  </p>
                  <p className="text-indigo-300 text-sm font-medium">
                    Please upload a PDF or DOCX file.
                  </p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={e => { setResume(e.target.files[0]); setMessage(''); }}
                  accept=".pdf,.doc,.docx"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={applying || !resume}
                className="bg-white text-indigo-900 hover:bg-indigo-50 font-extrabold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-xl self-start disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed group flex items-center gap-2"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}

      {!user && (
        <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-10 border border-slate-200 text-center shadow-sm">
          <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600"><Briefcase size={32}/></div>
          <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Want to apply for this job?</h3>
          <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto">Create a free Job Seeker account or log in to submit your resume directly to the employer.</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => navigate('/login')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 px-8 rounded-full transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Log In to Apply
            </button>
            <button onClick={() => navigate('/register')} className="bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 font-extrabold py-3.5 px-8 rounded-full transition-colors shadow-sm">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
