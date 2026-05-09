import React, { useState, useEffect } from 'react';
import { projectsAPI, tasksAPI, usersAPI } from '../utils/api';
import { ProjectList } from '../components/ProjectList';
import { TaskStats } from '../components/TaskStats';
import { QuickActions } from '../components/QuickActions';
import '../styles/Dashboard.css';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
  onSelectProject: (projectId: number) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout, onSelectProject }) => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [projectsRes, statsRes] = await Promise.all([
        projectsAPI.getAll(),
        tasksAPI.getStats(),
      ]);
      setProjects(projectsRes.data.projects);
      setStats(statsRes.data.stats);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Task Manager Dashboard</h1>
          <p>Welcome, {user.name}! {user.role === 'ADMIN' && '👑 Admin'}</p>
        </div>
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="dashboard-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div className="dashboard-grid">
              <div className="stats-section">
                <TaskStats stats={stats} />
                <QuickActions onRefresh={loadDashboard} user={user} />
              </div>

              <div className="projects-section">
                <ProjectList
                  user={user}
                  projects={projects}
                  onSelectProject={onSelectProject}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
