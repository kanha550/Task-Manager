import React from 'react';

interface TaskStatsProps {
  stats: any;
}

export const TaskStats: React.FC<TaskStatsProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="task-stats">
      <h2>📊 Task Overview</h2>
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card todo">
          <div className="stat-number">{stats.todo}</div>
          <div className="stat-label">To Do</div>
        </div>
        <div className="stat-card inprogress">
          <div className="stat-number">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card completed">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        {stats.overdue > 0 && (
          <div className="stat-card overdue">
            <div className="stat-number">{stats.overdue}</div>
            <div className="stat-label">⚠️ Overdue</div>
          </div>
        )}
      </div>
    </div>
  );
};
