import { useEffect, useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, Calendar, CheckCircle, Clock, MapPin, Building2, ChevronRight, FileSearch, UserCircle, Edit3, Award, FileText, Upload, MessageSquare } from 'lucide-react';
import ChatModal from '../components/ChatModal';

export default function JobSeekerDashboard() {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications');
  const [activeChatApp, setActiveChatApp] = useState(null);
  const [expandedAppId, setExpandedAppId] = useState(null);
  
  // Profile Form State
  const [bio, setBio] = useState('');
  const [certificates, setCertificates] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [message, setMessage] = useState('');

  const resumeInputRef = useRef(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [appsRes, profileRes] = await Promise.all([
          api.get('/applications/user'),
          api.get('/users/me')
        ]);
        setApplications(appsRes.data);
        setProfile(profileRes.data);
        setBio(profileRes.data.bio || '');
        setCertificates(profileRes.data.certificates || '');
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const calculateProfileStrength = () => {
    if (!user) return 0;
    let score = 0;
    if (user.name) score += 10;
    if (user.email) score += 10;
    if (profile?.bio) score += 20;
    if (profile?.certificates) score += 20;
    if (profile?.resumeData) score += 40;
    return score;
  };

  const profileStrength = calculateProfileStrength();

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setMessage('');

    const formData = new FormData();
    if (bio) formData.append('bio', bio);
    if (certificates) formData.append('certificates', certificates);
    if (resumeFile) formData.append('resume', resumeFile);

    try {
      const res = await api.put('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfile(res.data);
      setMessage('Profile updated successfully!');
      setResumeFile(null); // clear the pending file
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Premium Header */}
      <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 rounded-[2rem] p-10 shadow-2xl shadow-indigo-200 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="relative">
          <div className="w-28 h-28 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full p-1 shadow-inner">
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-4xl font-bold text-white overflow-hidden">
              {profile?.resumeData ? 
                <span className="text-sm font-medium text-emerald-400">Ready</span> : 
                user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
        <div className="text-center md:text-left relative z-10 text-white flex-1">
          <div className="inline-block px-3 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider mb-3">
            Job Seeker Profile
          </div>
          <h1 className="text-4xl font-extrabold mb-2">{user.name}</h1>
          <p className="text-slate-300 text-lg flex items-center gap-2 justify-center md:justify-start">
            {user.email} {profile?.resumeData && <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded-full border border-emerald-500/30">Resume Uploaded</span>}
          </p>

          <div className="mt-6 max-w-sm mx-auto md:mx-0">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-slate-200">Profile Strength</span>
              <span className={profileStrength === 100 ? 'text-emerald-400' : 'text-indigo-300'}>{profileStrength}%</span>
            </div>
            <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden backdrop-blur-sm border border-white/10">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${profileStrength === 100 ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-gradient-to-r from-indigo-500 to-purple-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]'}`} 
                style={{ width: `${profileStrength}%` }}
              ></div>
            </div>
            {profileStrength < 100 && (
              <p className="text-xs text-indigo-200 mt-2 font-medium flex items-center gap-1.5 justify-center md:justify-start">
                <ChevronRight size={14} className="text-indigo-400"/> Complete your profile to stand out!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-200 pb-px">
        <button 
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 pb-4 text-lg font-bold transition-all border-b-2 ${activeTab === 'applications' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
        >
          <Briefcase size={20} /> My Applications
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 pb-4 text-lg font-bold transition-all border-b-2 ${activeTab === 'profile' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
        >
          <UserCircle size={20} /> Edit Profile
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : activeTab === 'applications' ? (
        // APPLICATIONS TAB
        applications.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-16 text-center flex flex-col items-center justify-center shadow-sm animate-in zoom-in-95 duration-300">
            <div className="bg-indigo-50 text-indigo-500 w-24 h-24 rounded-full flex items-center justify-center mb-6">
              <FileSearch size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">No applications found</h3>
            <p className="text-slate-500 mb-8 max-w-md">Your dream job is out there! Start exploring thousands of open opportunities and land your next big role.</p>
            <Link to="/jobs" className="bg-indigo-600 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all">
              Explore Open Jobs
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {applications.map(app => (
              <div key={app.id} 
                   onClick={() => setExpandedAppId(expandedAppId === app.id ? null : app.id)}
                   className="bg-white/80 backdrop-blur-lg p-6 border border-white/40 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col gap-6 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                      <Briefcase size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{app.job.title}</h3>
                      <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm font-medium text-slate-500 mb-3">
                        <span className="flex items-center gap-1.5"><Building2 size={16}/> {app.job.company}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={16}/> {app.job.location}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-400 bg-slate-100 inline-flex items-center gap-1.5 px-3 py-1 rounded-full">
                        <Calendar size={12}/> Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold shadow-sm
                      ${app.status === 'PENDING' ? 'bg-amber-100/50 text-amber-700 border border-amber-200/50' : 
                        (app.status === 'ACCEPTED' || app.status === 'INTERVIEWING') ? 'bg-emerald-100/50 text-emerald-700 border border-emerald-200/50' : 
                        'bg-rose-100/50 text-rose-700 border border-rose-200/50'}`}>
                      {app.status === 'PENDING' ? <Clock size={16}/> : <CheckCircle size={16}/>}
                      {app.status}
                    </span>
                    
                    {(app.status === 'ACCEPTED' || app.status === 'INTERVIEWING') && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveChatApp(app); }}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm transition-colors"
                      >
                        <MessageSquare size={16}/> Chat
                      </button>
                    )}
                    <ChevronRight className={`text-slate-300 group-hover:text-indigo-600 transition-transform duration-300 ml-3 ${expandedAppId === app.id ? 'rotate-90 text-indigo-600' : ''}`} />
                  </div>
                </div>

                {/* Expanded Timeline View */}
                {expandedAppId === app.id && (
                  <div className="pt-6 mt-2 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300 cursor-default" onClick={e => e.stopPropagation()}>
                    <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                       Application Progress Timeline
                    </h4>
                    
                    <div className="relative border-l-2 border-indigo-100 ml-3 space-y-8 pb-4">
                      
                      {/* Step 1: Application Submitted */}
                      <div className="relative pl-8">
                        <div className="absolute -left-[11px] top-0.5 bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center border-4 border-white"><CheckCircle size={10} strokeWidth={4}/></div>
                        <h5 className="font-bold text-slate-800 text-sm">Application Submitted</h5>
                        <p className="text-slate-500 text-xs mt-1">You successfully applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                      </div>

                      {/* Step 2: Under Review */}
                      <div className="relative pl-8">
                        <div className={`absolute -left-[11px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-4 border-white ${(app.status === 'PENDING' || app.status === 'INTERVIEWING' || app.status === 'ACCEPTED' || app.status === 'REJECTED') ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>{(app.status !== 'PENDING') ? <CheckCircle size={10} strokeWidth={4}/> : <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}</div>
                        <h5 className={`font-bold text-sm ${(app.status === 'PENDING' || app.status === 'INTERVIEWING' || app.status === 'ACCEPTED' || app.status === 'REJECTED') ? 'text-slate-800' : 'text-slate-400'}`}>In Review</h5>
                        <p className="text-slate-500 text-xs mt-1">The employer is currently reviewing your resume and profile.</p>
                      </div>

                      {/* Step 3: Interviewing (Only show if actually Interviewing or Accepted) */}
                      {(app.status === 'INTERVIEWING' || app.status === 'ACCEPTED') && (
                        <div className="relative pl-8 animate-in fade-in slide-in-from-top-2">
                          <div className={`absolute -left-[11px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-4 border-white bg-indigo-600 text-white`}>{app.status === 'ACCEPTED' ? <CheckCircle size={10} strokeWidth={4}/> : <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}</div>
                          <h5 className="font-bold text-slate-800 text-sm">Interview Phase</h5>
                          <p className="text-slate-500 text-xs mt-1">You have advanced to the interviewing stage!</p>
                        </div>
                      )}

                      {/* Step 4: Final Decision */}
                      <div className="relative pl-8">
                        <div className={`absolute -left-[11px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-4 border-white 
                          ${app.status === 'ACCEPTED' ? 'bg-emerald-500 text-white' : 
                            app.status === 'REJECTED' ? 'bg-rose-500 text-white' : 'bg-slate-200'}`}>
                          {(app.status === 'ACCEPTED' || app.status === 'REJECTED') ? <CheckCircle size={10} strokeWidth={4}/> : null}
                        </div>
                        <h5 className={`font-bold text-sm 
                          ${app.status === 'ACCEPTED' ? 'text-emerald-600' : 
                            app.status === 'REJECTED' ? 'text-rose-600' : 'text-slate-400'}`}>
                          {app.status === 'ACCEPTED' ? 'Offer Extended 🎉' : app.status === 'REJECTED' ? 'Not Selected' : 'Final Decision'}
                        </h5>
                        <p className="text-slate-500 text-xs mt-1">
                          {app.status === 'ACCEPTED' ? 'Congratulations! You have been accepted for this role.' : 
                           app.status === 'REJECTED' ? 'Unfortunately, the employer has decided to move forward with other candidates.' : 
                           'Waiting for the final update from the employer.'}
                        </p>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        // PROFILE TAB
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600"><Edit3 size={24} /></div>
            <div>
              <h2 className="text-3xl font-extrabold text-slate-800">Enhance Your Profile</h2>
              <p className="text-slate-500 mt-1 font-medium">Employers look for detailed profiles. Add your experience and resume to stand out.</p>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${message.includes('success') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2"><UserCircle size={16} /> Professional Bio</label>
              <textarea 
                rows="4" 
                placeholder="Tell employers about your background, skills, and what you're looking for..." 
                className="w-full bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 p-4 rounded-xl transition-all resize-none text-slate-700" 
                value={bio} 
                onChange={e => setBio(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2"><Award size={16} /> Certifications & Awards</label>
              <textarea 
                rows="3" 
                placeholder="List your relevant certifications, e.g., AWS Certified Solutions Architect, PMP..." 
                className="w-full bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 p-4 rounded-xl transition-all resize-none text-slate-700" 
                value={certificates} 
                onChange={e => setCertificates(e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2"><FileText size={16} /> Resume/CV Upload</label>
              <div 
                onClick={() => resumeInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 hover:bg-indigo-50 transition-colors rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer"
              >
                <div className="bg-white p-3 rounded-full shadow-sm text-indigo-500">
                  <Upload size={24} />
                </div>
                <div className="text-center">
                  <p className="text-slate-700 font-bold mb-1">
                    {resumeFile ? resumeFile.name : 'Click to select a new resume'}
                  </p>
                  <p className="text-slate-400 text-xs font-medium">
                    PDF, DOC, DOCX up to 5MB. {profile?.resumeData && !resumeFile && 'You have an existing resume uploaded.'}
                  </p>
                </div>
                <input 
                  type="file" 
                  ref={resumeInputRef} 
                  className="hidden" 
                  onChange={e => setResumeFile(e.target.files[0])}
                  accept=".pdf,.doc,.docx"
                />
              </div>
              {profile?.resumeData && !resumeFile && (
                <div className="flex justify-end pr-2 pt-1">
                  <a href={`http://localhost:8080/api/users/resume`} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 font-bold hover:text-indigo-800 underline">
                    Download Current Resume
                  </a>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" 
                disabled={savingProfile}
                className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-extrabold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {savingProfile ? 'Saving updates...' : 'Save Profile Details'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeChatApp && (
        <ChatModal application={activeChatApp} onClose={() => setActiveChatApp(null)} />
      )}
    </div>
  );
}
