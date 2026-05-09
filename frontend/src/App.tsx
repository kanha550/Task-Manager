import React, { useState, useEffect } from 'react';
import { AuthPage } from './pages/Auth';
import { DashboardPage } from './pages/Dashboard';
import { ProjectDetailPage } from './pages/ProjectDetail';
import './App.css';

type View = 'auth' | 'dashboard' | 'project-detail';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

function App() {
  const [currentView, setCurrentView] = useState<View>('auth');
  const [user, setUser] = useState<User | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setCurrentView('dashboard');
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (token: string, user: User) => {
    setUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('auth');
  };

  const handleSelectProject = (projectId: number) => {
    setSelectedProjectId(projectId);
    setCurrentView('project-detail');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedProjectId(null);
  };

  return (
    <div className="app">
      {currentView === 'auth' && <AuthPage onLogin={handleLogin} />}

      {currentView === 'dashboard' && user && (
        <DashboardPage
          user={user}
          onLogout={handleLogout}
          onSelectProject={handleSelectProject}
        />
      )}

      {currentView === 'project-detail' && user && selectedProjectId && (
        <ProjectDetailPage
          projectId={selectedProjectId}
          user={user}
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
}

export default App;
