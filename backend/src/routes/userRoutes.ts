import express from 'express';
import { body } from 'express-validator';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  linkUsers,
  unlinkUsers,
  getGraphData
} from '../controllers/userController';

const router = express.Router();

// Validation middleware
const userValidation = [
  body('username').trim().isLength({ min: 2, max: 50 }).withMessage('Username must be between 2 and 50 characters'),
  body('age').isInt({ min: 1, max: 150 }).withMessage('Age must be between 1 and 150'),
  body('hobbies').isArray().withMessage('Hobbies must be an array')
];

const updateValidation = [
  body('username').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Username must be between 2 and 50 characters'),
  body('age').optional().isInt({ min: 1, max: 150 }).withMessage('Age must be between 1 and 150'),
  body('hobbies').optional().isArray().withMessage('Hobbies must be an array')
];

// Routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', userValidation, createUser);
router.put('/users/:id', updateValidation, updateUser);
router.delete('/users/:id', deleteUser);
router.post('/users/:id/link', linkUsers);
router.delete('/users/:id/unlink', unlinkUsers);
router.get('/graph', getGraphData);

export default router;
