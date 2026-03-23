import { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, Briefcase, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, jobsRes] = await Promise.all([
          api.get('/users'),
          api.get('/jobs/all-jobs')
        ]);
        setUsers(usersRes.data);
        setJobs(jobsRes.data);
      } catch (err) {
        console.error("Admin forbidden or error", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      
      {/* Header Area */}
      <div className="flex items-center gap-4 mb-10 bg-white/60 p-6 rounded-3xl border border-white/40 shadow-sm backdrop-blur-md">
        <div className="bg-red-100 p-4 rounded-2xl text-red-600">
          <ShieldCheck size={32} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 text-transparent bg-clip-text">
            Admin Control Panel
          </h1>
          <p className="text-slate-500 font-medium">Manage all platform users and job listings globally.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        
        {/* Users Table */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
              <span className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600"><Users size={20} strokeWidth={2.5}/></span> 
              Platform Users
            </h2>
            <div className="bg-indigo-50 text-indigo-700 font-bold px-4 py-1.5 rounded-full text-sm border border-indigo-100">
              Total: {users.length}
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-tl-xl rounded-tr-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-100 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="pb-4 font-bold px-2">Name</th>
                  <th className="pb-4 font-bold px-2">Email</th>
                  <th className="pb-4 font-bold px-2">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-2 font-bold text-slate-800">{u.name}</td>
                    <td className="py-5 px-2 text-slate-500 font-medium text-sm">{u.email}</td>
                    <td className="py-5 px-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border
                        ${u.role === 'ROLE_ADMIN' ? 'bg-red-50 text-red-600 border-red-100' :
                          u.role === 'ROLE_EMPLOYER' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                          'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        {u.role.replace('ROLE_', '')}
                      </span>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center py-10 text-slate-400 font-medium">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
              <span className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600"><Briefcase size={20} strokeWidth={2.5}/></span> 
              Total Jobs
            </h2>
            <div className="bg-emerald-50 text-emerald-700 font-bold px-4 py-1.5 rounded-full text-sm border border-emerald-100">
              Total: {jobs.length}
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-tl-xl rounded-tr-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-100 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="pb-4 font-bold px-2">Title</th>
                  <th className="pb-4 font-bold px-2">Company</th>
                  <th className="pb-4 font-bold px-2">Employer ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map(j => (
                  <tr key={j.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-2 font-bold text-slate-800">{j.title}</td>
                    <td className="py-5 px-2 text-slate-500 font-medium text-sm">{j.company}</td>
                    <td className="py-5 px-2">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold text-xs">
                        #{j.employer?.id}
                      </div>
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center py-10 text-slate-400 font-medium">No jobs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
