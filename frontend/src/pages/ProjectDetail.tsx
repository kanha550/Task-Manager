import React, { useState, useEffect } from 'react';
import { projectsAPI, tasksAPI, usersAPI } from '../utils/api';
import { TaskBoard } from '../components/TaskBoard';
import '../styles/ProjectDetail.css';

interface ProjectDetailPageProps {
  projectId: number;
  user: any;
  onBack: () => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  projectId,
  user,
  onBack,
}) => {
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberToAdd, setMemberToAdd] = useState<number | ''>('');

  useEffect(() => {
    loadProjectDetails();
  }, [projectId]);

  const loadProjectDetails = async () => {
    try {
      setLoading(true);
      const [projectRes, tasksRes, usersRes] = await Promise.all([
        projectsAPI.getById(projectId),
        tasksAPI.getByProject(projectId),
        usersAPI.getAll(),
      ]);
      setProject(projectRes.data.project);
      setTasks(tasksRes.data.tasks);
      setAllUsers(usersRes.data.users);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!project) return <div className="error">Project not found</div>;

  const isOwner = project.ownerId === user.id;
  const taskCounts = {
    todo: tasks.filter((t) => t.status === 'TODO').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    completed: tasks.filter((t) => t.status === 'COMPLETED').length,
  };

  return (
    <div className="project-detail">
      <div className="project-detail-header">
        <button onClick={onBack} className="back-button">
          ← Back
        </button>
        <div className="project-info">
          <h1>{project.name}</h1>
          <p>{project.description}</p>
        </div>
        {isOwner && (
          <div className="project-actions">
            <button
              onClick={() => setShowMemberForm(true)}
              className="btn-secondary"
              type="button"
            >
              👥 Add Member
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!window.confirm('Delete this project and all tasks?')) return;
                try {
                  await projectsAPI.delete(projectId);
                  onBack();
                } catch (err: any) {
                  setError(err.response?.data?.message || 'Failed to delete project');
                }
              }}
              className="btn-danger"
            >
              Delete Project
            </button>
          </div>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="project-content">
        <div className="project-sidebar">
          <div className="sidebar-section">
            <h3>Project Stats</h3>
            <div className="stats">
              <div className="stat">
                <span className="stat-value">{taskCounts.todo}</span>
                <span className="stat-label">To Do</span>
              </div>
              <div className="stat">
                <span className="stat-value">{taskCounts.inProgress}</span>
                <span className="stat-label">In Progress</span>
              </div>
              <div className="stat">
                <span className="stat-value">{taskCounts.completed}</span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Team Members ({project.members?.length || 0})</h3>
            <div className="members-list">
              <div className="member owner-member">
                <span className="member-name">{project.owner?.name}</span>
                <span className="member-role">Owner</span>
              </div>
              {project.members?.map((member: any) => (
                <div key={member.id} className="member">
                  <div>
                    <span className="member-name">{member.user.name}</span>
                    <span className="member-email">{member.user.email}</span>
                  </div>
                  {isOwner && (
                    <button
                      type="button"
                      className="btn-small btn-danger"
                      onClick={async () => {
                        if (!window.confirm(`Remove ${member.user.name} from the project?`)) return;
                        try {
                          await projectsAPI.removeMember(projectId, member.user.id);
                          loadProjectDetails();
                        } catch (err: any) {
                          setError(err.response?.data?.message || 'Failed to remove member');
                        }
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="project-main">
          <div className="tasks-header">
            <h2>📋 Tasks</h2>
          </div>

          <TaskBoard
            tasks={tasks}
            onTasksChange={loadProjectDetails}
            projectId={projectId}
            isOwner={isOwner}
            allUsers={allUsers}
          />
        </div>
      </div>

      {showMemberForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Member</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!memberToAdd) return;
                try {
                  await projectsAPI.addMember(projectId, memberToAdd);
                  setMemberToAdd('');
                  setShowMemberForm(false);
                  loadProjectDetails();
                } catch (err: any) {
                  setError(err.response?.data?.message || 'Failed to add member');
                }
              }}
            >
              <select
                value={memberToAdd}
                onChange={(e) => setMemberToAdd(e.target.value ? parseInt(e.target.value) : '')}
              >
                <option value="">Select user</option>
                {allUsers
                  .filter((user) => {
                    const isAlreadyMember = project.members?.some(
                      (member: any) => member.user.id === user.id
                    );
                    return user.id !== project.ownerId && !isAlreadyMember;
                  })
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
              </select>

              <div className="modal-buttons">
                <button
                  type="button"
                  onClick={() => setShowMemberForm(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
