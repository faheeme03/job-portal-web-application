import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Building, Users, Briefcase, MapPin, DollarSign, X, FileText, CheckCircle, XCircle } from 'lucide-react';

export default function EmployerDashboard() {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showPostJob, setShowPostJob] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [newJob, setNewJob] = useState({ title: '', company: '', description: '', location: '', salary: '' });

  useEffect(() => {
    fetchData();
  },[]);

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get('/jobs/employer'),
        api.get('/applications/employer')
      ]);
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      await api.post('/jobs', { ...newJob, salary: parseFloat(newJob.salary) });
      setShowPostJob(false);
      setNewJob({ title: '', company: '', description: '', location: '', salary: '' });
      fetchData();
    } catch (err) {
      alert('Error posting job');
    }
  };

  const updateAppStatus = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}/status?status=${status}`);
      setSelectedApp(prev => ({ ...prev, status }));
      fetchData(); // Refresh the list
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 relative">
      {/* Premium Header */}
      <div className="bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-900 rounded-[2rem] p-10 shadow-2xl shadow-indigo-200 mb-10 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="relative z-10">
          <div className="inline-block px-3 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-white mb-3">
            Employer Portal
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Welcome back, {user.name}</h1>
          <p className="text-indigo-200 text-lg">Manage your job listings and review applicants easily.</p>
        </div>
        <button 
          onClick={() => setShowPostJob(!showPostJob)} 
          className="relative z-10 bg-white text-indigo-900 hover:bg-indigo-50 font-extrabold py-3.5 px-8 rounded-full transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:scale-105 flex items-center gap-3"
        >
          {showPostJob ? <X size={20} className="text-red-500" /> : <PlusCircle size={20} className="text-indigo-600" />} 
          {showPostJob ? 'Cancel Creation' : 'Post New Job'}
        </button>
      </div>

      {showPostJob && (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600"><Briefcase size={24} /></div>
            <h2 className="text-3xl font-extrabold text-slate-800">Create Job Listing</h2>
          </div>
          <form onSubmit={handlePostJob} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Job Title</label>
              <input type="text" required placeholder="e.g. Senior Frontend Developer" className="w-full bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 p-4 rounded-xl transition-all" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Company Name</label>
              <input type="text" required placeholder="Acme Corp" className="w-full bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 p-4 rounded-xl transition-all" value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Location</label>
              <input type="text" required placeholder="San Francisco, CA (or Remote)" className="w-full bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 p-4 rounded-xl transition-all" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Salary (USD)</label>
              <input type="number" required placeholder="120000" className="w-full bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 p-4 rounded-xl transition-all" value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Job Description</label>
              <textarea required rows="4" placeholder="Describe the responsibilities, requirements..." className="w-full bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 p-4 rounded-xl transition-all resize-none" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} />
            </div>
            <div className="md:col-span-2 pt-2">
              <button type="submit" className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-4 rounded-xl font-extrabold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all">Publish Job Post</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-3">
            <span className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600"><Building size={20} strokeWidth={2.5}/></span> 
            My Posted Jobs ({jobs.length})
          </h2>
          <div className="grid gap-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-white/80 p-6 border border-white/40 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all group">
                <h3 className="font-extrabold text-xl text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
                  <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400"/> {job.location}</span>
                  <span className="flex items-center gap-1.5"><DollarSign size={16} className="text-emerald-500"/> ${job.salary.toLocaleString()}</span>
                </div>
              </div>
            ))}
            {jobs.length === 0 && (
              <div className="bg-white/40 border border-dashed border-slate-300 p-10 rounded-3xl text-center">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 shadow-sm"><Briefcase size={24}/></div>
                <p className="text-slate-500 font-bold">No jobs posted yet.</p>
                <p className="text-slate-400 text-sm mt-2">Click the button above to create your first listing.</p>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-3">
            <span className="bg-fuchsia-100 p-2.5 rounded-xl text-fuchsia-600"><Users size={20} strokeWidth={2.5}/></span> 
            Recent Applicants ({applications.length})
          </h2>
          <div className="grid gap-4">
            {applications.map(app => (
              <div 
                key={app.id} 
                onClick={() => setSelectedApp(app)}
                className="bg-white/80 p-6 border border-white/40 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-indigo-200 transition-all flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center cursor-pointer group"
              >
                <div>
                  <h3 className="font-extrabold text-lg text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{app.user.name}</h3>
                  <p className="text-slate-500 text-sm font-medium">{app.user.email}</p>
                  <div className="mt-3 inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700">
                    <Briefcase size={14} className="text-indigo-500" /> {app.job.title}
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span className={`px-4 py-2 rounded-full text-xs font-extrabold tracking-wide uppercase shadow-sm
                    ${app.status === 'PENDING' ? 'bg-amber-100/80 text-amber-700 border border-amber-200' : 
                      app.status === 'ACCEPTED' ? 'bg-emerald-100/80 text-emerald-700 border border-emerald-200' : 
                      'bg-rose-100/80 text-rose-700 border border-rose-200'}`}>
                    {app.status}
                  </span>
                  <span className="text-indigo-600 text-xs font-bold hidden group-hover:flex items-center gap-1"><FileText size={14}/> View Application</span>
                </div>
              </div>
            ))}
            {applications.length === 0 && (
              <div className="bg-white/40 border border-dashed border-slate-300 p-10 rounded-3xl text-center">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 shadow-sm"><Users size={24}/></div>
                <p className="text-slate-500 font-bold">No applications received yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Applicaton Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-300">
            {/* Modal Header */}
            <div className="bg-indigo-50 border-b border-indigo-100 p-6 sm:px-10 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
              <div className="relative z-10">
                <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Briefcase size={14}/> Applying for: {selectedApp.job.title}
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900">{selectedApp.user.name}</h2>
                <p className="text-slate-600 font-medium mt-1">{selectedApp.user.email}</p>
                {selectedApp.user.bio && <p className="text-slate-600 italic text-sm mt-3 border-l-2 border-indigo-300 pl-3">"{selectedApp.user.bio}"</p>}
                {selectedApp.user.certificates && <p className="text-slate-600 text-sm mt-2 font-medium">🏅 Included Certificates: {selectedApp.user.certificates}</p>}
              </div>
              <button 
                onClick={() => setSelectedApp(null)}
                className="relative z-10 bg-white/50 hover:bg-white text-slate-500 hover:text-red-500 p-2 rounded-full transition-all"
              >
                <X size={28} />
              </button>
            </div>
            
            {/* Modal Body: Resume Embed & Actions */}
            <div className="flex-1 overflow-auto bg-slate-100 p-6 sm:px-10 flex flex-col gap-6">
              <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="bg-slate-50 py-3 px-6 border-b border-slate-200 flex justify-between items-center text-sm font-bold text-slate-600">
                  <span className="flex items-center gap-2"><FileText size={18}/> {selectedApp.fileName}</span>
                  <a href={`http://localhost:8080/api/applications/${selectedApp.id}/resume`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 hover:underline">
                    Open in New Tab
                  </a>
                </div>
                <div className="flex-1 bg-slate-200/50 relative min-h-[50vh]">
                  {/* We use iframe or object to embed standard PDFs inline */}
                  <iframe 
                    title="Resume Viewer"
                    src={`http://localhost:8080/api/applications/${selectedApp.id}/resume`} 
                    className="absolute inset-0 w-full h-full border-none bg-white"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-white border-t border-slate-100 p-6 sm:px-10 flex justify-between items-center">
              <div className={`px-4 py-2 rounded-xl text-sm font-extrabold tracking-wide uppercase
                  ${selectedApp.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                    selectedApp.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' : 
                    'bg-rose-100 text-rose-700'}`}>
                  Current Status: {selectedApp.status}
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => updateAppStatus(selectedApp.id, 'REJECTED')}
                  disabled={selectedApp.status === 'REJECTED'}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors disabled:opacity-50"
                >
                  <XCircle size={18}/> Reject
                </button>
                <button 
                  onClick={() => updateAppStatus(selectedApp.id, 'ACCEPTED')}
                  disabled={selectedApp.status === 'ACCEPTED'}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-600/20 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  <CheckCircle size={18}/> Accept Applicant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
