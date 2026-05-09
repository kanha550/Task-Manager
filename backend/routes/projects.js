const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient({});

// CREATE PROJECT (requires auth)
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: req.user.id
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } }
      }
    });

    res.status(201).json({ message: 'Project created', project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET ALL PROJECTS (user's projects + projects they're a member of)
router.get('/', auth, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: req.user.id },
          { members: { some: { userId: req.user.id } } }
        ]
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        tasks: { select: { id: true, status: true } }
      }
    });

    res.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET PROJECT DETAILS
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, email: true } }
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check authorization (owner or member)
    const isMember = project.members.some(m => m.userId === req.user.id);
    if (project.ownerId !== req.user.id && !isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE PROJECT (owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Only project owner can update' });
    }

    const updated = await prisma.project.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: req.body.name || project.name,
        description: req.body.description !== undefined ? req.body.description : project.description
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } }
      }
    });

    res.json({ message: 'Project updated', project: updated });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE PROJECT (owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Only project owner can delete' });
    }

    await prisma.project.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADD MEMBER TO PROJECT
router.post('/:id/members', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const projectId = parseInt(req.params.id);

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Only project owner can add members' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingMember = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId, projectId } }
    });

    if (existingMember) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    const member = await prisma.projectMember.create({
      data: { userId, projectId },
      include: { user: { select: { id: true, name: true, email: true } } }
    });

    res.status(201).json({ message: 'Member added', member });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// REMOVE MEMBER FROM PROJECT
router.delete('/:id/members/:userId', auth, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Only project owner can remove members' });
    }

    await prisma.projectMember.delete({
      where: { userId_projectId: { userId, projectId } }
    });

    res.json({ message: 'Member removed' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
