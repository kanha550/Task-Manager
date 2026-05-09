const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient({});

// Helper: Check if user has access to project
const checkProjectAccess = async (userId, projectId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: { where: { userId } } }
  });

  if (!project) return false;
  return project.ownerId === userId || project.members.length > 0;
};

// CREATE TASK
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, priority, dueDate, projectId, assigneeId } = req.body;

    // Validation
    if (!title || !projectId) {
      return res.status(400).json({ message: 'Title and projectId are required' });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check access to project
    const hasAccess = project.ownerId === req.user.id || project.members.some((m) => m.userId === req.user.id);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Validate priority
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority' });
    }

    if (assigneeId) {
      const assigneeAllowed =
        assigneeId === project.ownerId || project.members.some((m) => m.userId === assigneeId);
      if (!assigneeAllowed) {
        return res.status(400).json({ message: 'Assignee must be part of the project team' });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId: assigneeId || null
      },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } }
      }
    });

    res.status(201).json({ message: 'Task created', task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET PROJECT TASKS
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);

    // Check access
    const hasAccess = await checkProjectAccess(req.user.id, projectId);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET ALL USER'S TASKS (from all projects)
router.get('/user/my-tasks', auth, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { assigneeId: req.user.id },
          { project: { ownerId: req.user.id } },
          { project: { members: { some: { userId: req.user.id } } } }
        ]
      },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Get user tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET SINGLE TASK
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        project: { select: { id: true, name: true, ownerId: true } },
        assignee: { select: { id: true, name: true, email: true } }
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check access
    const hasAccess = await checkProjectAccess(req.user.id, task.projectId);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE TASK
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { project: true }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check access (project owner or members can update)
    const hasAccess = await checkProjectAccess(req.user.id, task.projectId);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, status, priority, dueDate, assigneeId } = req.body;

    // Validate status
    const validStatuses = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Validate priority
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority' });
    }

    if (assigneeId !== undefined && assigneeId !== null) {
      const project = await prisma.project.findUnique({
        where: { id: task.projectId },
        include: { members: true }
      });
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      const assigneeAllowed =
        assigneeId === project.ownerId || project.members.some((m) => m.userId === assigneeId);
      if (!assigneeAllowed) {
        return res.status(400).json({ message: 'Assignee must be part of the project team' });
      }
    }

    const updated = await prisma.task.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title: title || task.title,
        description: description !== undefined ? description : task.description,
        status: status || task.status,
        priority: priority || task.priority,
        dueDate: dueDate ? new Date(dueDate) : task.dueDate,
        assigneeId: assigneeId !== undefined ? assigneeId : task.assigneeId
      },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } }
      }
    });

    res.json({ message: 'Task updated', task: updated });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE TASK
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { project: true }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check access (project owner can delete)
    const project = await prisma.project.findUnique({
      where: { id: task.projectId }
    });

    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Only project owner can delete tasks' });
    }

    await prisma.task.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET DASHBOARD STATS
router.get('/', auth, async (req, res) => {
  try {
    // Get all tasks assigned to user or in their projects
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { assigneeId: req.user.id },
          { project: { ownerId: req.user.id } },
          { project: { members: { some: { userId: req.user.id } } } }
        ]
      }
    });

    // Calculate stats
    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'TODO').length,
      inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
      completed: tasks.filter(t => t.status === 'COMPLETED').length,
      overdue: tasks.filter(t => {
        if (t.dueDate && t.status !== 'COMPLETED') {
          return new Date(t.dueDate) < new Date();
        }
        return false;
      }).length
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
