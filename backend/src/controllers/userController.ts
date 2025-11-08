import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import User, { IUser } from '../models/User';
import { v4 as uuidv4 } from 'uuid';

// Get all users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Get single user by ID
export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findOne({ id: req.params.id });
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Create new user
export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    
    const { username, age, hobbies } = req.body;
    
    const newUser = new User({
      id: uuidv4(),
      username,
      age,
      hobbies: hobbies || [],
      friends: [],
      createdAt: new Date(),
      popularityScore: 0
    });
    
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

// Update user
export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    
    const { username, age, hobbies } = req.body;
    const user = await User.findOne({ id: req.params.id });
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    if (username) user.username = username;
    if (age) user.age = age;
    if (hobbies) user.hobbies = hobbies;
    
    // Recalculate popularity score
    await user.calculatePopularityScore();
    await user.save();
    
    // Update popularity scores for all friends
    await updateFriendsPopularityScores(user.friends);
    
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findOne({ id: req.params.id });
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    // Check if user has friends
    if (user.friends.length > 0) {
      res.status(409).json({ 
        error: 'Cannot delete user with active friendships. Please unlink all friends first.',
        friendCount: user.friends.length
      });
      return;
    }
    
    // Check if user is in other users' friend lists
    const usersWithThisFriend = await User.find({ friends: user.id });
    if (usersWithThisFriend.length > 0) {
      res.status(409).json({ 
        error: 'User is still connected to other users. Please remove all connections first.',
        connectedUsers: usersWithThisFriend.length
      });
      return;
    }
    
    await User.deleteOne({ id: req.params.id });
    res.json({ message: 'User deleted successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// Create friendship/relationship
export const linkUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { friendId } = req.body;
    const userId = req.params.id;
    
    if (!friendId) {
      res.status(400).json({ error: 'friendId is required' });
      return;
    }
    
    if (userId === friendId) {
      res.status(400).json({ error: 'User cannot be friends with themselves' });
      return;
    }
    
    const user = await User.findOne({ id: userId });
    const friend = await User.findOne({ id: friendId });
    
    if (!user || !friend) {
      res.status(404).json({ error: 'User or friend not found' });
      return;
    }
    
    // Check if already friends
    if (user.friends.includes(friendId)) {
      res.status(409).json({ error: 'Users are already friends' });
      return;
    }
    
    // Add mutual friendship (prevent circular duplicates)
    user.friends.push(friendId);
    friend.friends.push(userId);
    
    // Recalculate popularity scores
    await user.calculatePopularityScore();
    await friend.calculatePopularityScore();
    
    await user.save();
    await friend.save();
    
    res.json({ 
      message: 'Friendship created successfully',
      user,
      friend
    });
  } catch (error) {
    next(error);
  }
};

// Remove friendship/relationship
export const unlinkUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { friendId } = req.body;
    const userId = req.params.id;
    
    if (!friendId) {
      res.status(400).json({ error: 'friendId is required' });
      return;
    }
    
    const user = await User.findOne({ id: userId });
    const friend = await User.findOne({ id: friendId });
    
    if (!user || !friend) {
      res.status(404).json({ error: 'User or friend not found' });
      return;
    }
    
    // Remove from both sides
    user.friends = user.friends.filter(id => id !== friendId);
    friend.friends = friend.friends.filter(id => id !== userId);
    
    // Recalculate popularity scores
    await user.calculatePopularityScore();
    await friend.calculatePopularityScore();
    
    await user.save();
    await friend.save();
    
    res.json({ 
      message: 'Friendship removed successfully',
      user,
      friend
    });
  } catch (error) {
    next(error);
  }
};

// Get graph data
export const getGraphData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.find();
    
    // Create nodes
    const nodes = users.map(user => ({
      id: user.id,
      data: {
        id: user.id,
        username: user.username,
        age: user.age,
        hobbies: user.hobbies,
        popularityScore: user.popularityScore
      }
    }));
    
    // Create edges (avoid duplicates)
    const edges: any[] = [];
    const processedPairs = new Set<string>();
    
    users.forEach(user => {
      user.friends.forEach(friendId => {
        const pairKey = [user.id, friendId].sort().join('-');
        
        if (!processedPairs.has(pairKey)) {
          processedPairs.add(pairKey);
          edges.push({
            id: pairKey,
            source: user.id,
            target: friendId
          });
        }
      });
    });
    
    res.json({ nodes, edges });
  } catch (error) {
    next(error);
  }
};

// Helper function to update friends' popularity scores
async function updateFriendsPopularityScores(friendIds: string[]): Promise<void> {
  for (const friendId of friendIds) {
    const friend = await User.findOne({ id: friendId });
    if (friend) {
      await friend.calculatePopularityScore();
      await friend.save();
    }
  }
}
