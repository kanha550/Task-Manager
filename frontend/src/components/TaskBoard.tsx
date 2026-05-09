import React, { useState } from 'react';
import { tasksAPI } from '../utils/api';

interface TaskBoardProps {
  tasks: any[];
  onTasksChange: () => void;
  projectId: number;
  isOwner: boolean;
  allUsers: any[];
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onTasksChange,
  projectId,
  isOwner,
  allUsers,
}) => {
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    assigneeId: null,
    dueDate: '',
  });

  const statuses = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
  const priorities = ['LOW', 'MEDIUM', 'HIGH'];

  const tasksByStatus = statuses.reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {} as Record<string, any[]>);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      await tasksAPI.create({
        ...newTask,
        projectId,
        assigneeId: newTask.assigneeId || null,
      });
      setNewTask({
        title: '',
        description: '',
        priority: 'MEDIUM',
        assigneeId: null,
        dueDate: '',
      });
      setShowNewTaskForm(false);
      onTasksChange();
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      await tasksAPI.update(taskId, { status: newStatus });
      onTasksChange();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await tasksAPI.delete(taskId);
      onTasksChange();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  return (
    <div className="task-board">
      <div className="tasks-header board-top">
        <h3>Tasks</h3>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowNewTaskForm(true)}
        >
          ➕ New Task
        </button>
      </div>

      <div className="board-columns">
        {statuses.map((status) => (
          <div key={status} className={`board-column column-${status.toLowerCase()}`}>
            <div className="column-header">
              <h3>{status.replace(/_/g, ' ')}</h3>
              <span className="task-count">{tasksByStatus[status].length}</span>
            </div>
            <div className="tasks-list">
              {tasksByStatus[status].map((task) => (
                <div
                  key={task.id}
                  className={`task-card priority-${task.priority.toLowerCase()}`}
                >
                  <div className="task-header">
                    <h4>{task.title}</h4>
                    {isOwner && (
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="btn-delete"
                        type="button"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  {task.description && <p className="task-desc">{task.description}</p>}
                  <div className="task-footer">
                    <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                    {task.assignee && (
                      <span className="assignee">{task.assignee.name}</span>
                    )}
                  </div>
                  {task.dueDate && (
                    <div className="task-due">
                      📅 {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                  {status !== 'COMPLETED' && (
                    <select
                      value={task.status}
                      onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                      className="status-select"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showNewTaskForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Task</h3>
            <form onSubmit={handleCreateTask}>
              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <select
                value={newTask.assigneeId || ''}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    assigneeId: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
              >
                <option value="">Unassigned</option>
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
              <div className="modal-buttons">
                <button
                  type="button"
                  onClick={() => setShowNewTaskForm(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
