import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import JobSeekerDashboard from './JobSeekerDashboard';
import EmployerDashboard from './EmployerDashboard';
import AdminDashboard from './AdminDashboard';
import { Navigate } from 'react-router-dom';

export default function DashboardRouting() {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case 'ROLE_JOB_SEEKER':
      return <JobSeekerDashboard />;
    case 'ROLE_EMPLOYER':
      return <EmployerDashboard />;
    case 'ROLE_ADMIN':
      return <AdminDashboard />;
    default:
      return <div>Unknown role</div>;
  }
}
