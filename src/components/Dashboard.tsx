import { useAuth } from '../context/AuthContext';
import { PrincipalDashboard } from './dashboards/PrincipalDashboard';
import { HODDashboard } from './dashboards/HODDashboard';
import { AdvisorDashboard } from './dashboards/AdvisorDashboard';

export function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'principal':
      return <PrincipalDashboard />;
    case 'hod':
      return <HODDashboard />;
    case 'advisor':
      return <AdvisorDashboard />;
    default:
      return null;
  }
}
