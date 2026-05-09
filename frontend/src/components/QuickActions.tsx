import React, { useState } from 'react';
import { projectsAPI, usersAPI } from '../utils/api';

interface QuickActionsProps {
  onRefresh: () => void;
  user: any;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onRefresh, user }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    setLoading(true);
    try {
      await projectsAPI.create({
        name: projectName,
        description: projectDesc,
      });
      setProjectName('');
      setProjectDesc('');
      setShowCreateModal(false);
      onRefresh();
    } catch (err) {
      console.error('Failed to create project:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data.users);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  return (
    <div className="quick-actions">
      <h2>⚡ Quick Actions</h2>
      <button
        onClick={() => setShowCreateModal(true)}
        className="action-button primary"
      >
        ➕ New Project
      </button>

      {user.role === 'ADMIN' && (
        <button
          type="button"
          className="action-button secondary"
          onClick={() => {
            setShowUsersModal(true);
            loadUsers();
          }}
        >
          👥 Manage Users
        </button>
      )}

      <button onClick={onRefresh} className="action-button">
        🔄 Refresh
      </button>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Project</h3>
            <form onSubmit={handleCreateProject}>
              <input
                type="text"
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                rows={3}
              />
              <div className="modal-buttons">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-submit"
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUsersModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>User Management</h3>
            {loadingUsers ? (
              <div>Loading users...</div>
            ) : (
              <div className="users-grid">
                {users.map((userItem) => (
                  <div key={userItem.id} className="user-card">
                    <div>
                      <p className="user-name">{userItem.name}</p>
                      <p className="user-email">{userItem.email}</p>
                    </div>
                    <span className="user-role">{userItem.role}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="modal-buttons">
              <button
                type="button"
                onClick={() => setShowUsersModal(false)}
                className="btn-cancel"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
