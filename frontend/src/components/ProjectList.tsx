import React from 'react';

interface ProjectListProps {
  user: any;
  projects: any[];
  onSelectProject: (projectId: number) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  user,
  projects,
  onSelectProject,
}) => {
  return (
    <div className="projects-list">
      <h2>📁 Your Projects</h2>
      {projects.length === 0 ? (
        <div className="empty-state">
          <p>No projects yet. Create your first project to get started!</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => {
            const taskCount = project.tasks?.length || 0;
            const isOwner = project.ownerId === user.id;

            return (
              <button
                key={project.id}
                type="button"
                className="project-card"
                onClick={() => onSelectProject(project.id)}
              >
                <div className="project-header">
                  <h3>{project.name}</h3>
                  {isOwner && <span className="owner-badge">Owner</span>}
                </div>
                <p className="project-desc">
                  {project.description || 'No description'}
                </p>
                <div className="project-footer">
                  <div className="project-stats">
                    <span>📋 {taskCount} tasks</span>
                    <span>👥 {project.members?.length || 0} members</span>
                  </div>
                  <div className="project-date">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
