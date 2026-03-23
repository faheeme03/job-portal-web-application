import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Building } from 'lucide-react';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs').then(res => {
      setJobs(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading jobs...</div>;

  return (
    <div className="py-8 max-w-5xl mx-auto">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8">Latest Opportunities</h2>
      <div className="grid gap-6">
        {jobs.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border text-gray-500 shadow-sm">No jobs available right now.</div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="bg-white p-6 border rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><Building size={16}/> {job.company}</span>
                  <span className="flex items-center gap-1"><MapPin size={16}/> {job.location}</span>
                  <span className="flex items-center gap-1"><DollarSign size={16}/> ${job.salary.toLocaleString()}</span>
                </div>
              </div>
              <Link to={`/jobs/${job.id}`} className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-6 py-3 rounded-xl font-semibold transition-colors whitespace-nowrap text-center">
                View Details
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
