import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { User, GraphNode, GraphEdge } from '../types';
import { userAPI } from '../services/api';
import { toast } from 'react-toastify';

interface AppState {
  users: User[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedUser: User | null;
  loading: boolean;
  allHobbies: string[];
}

type Action =
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_GRAPH_DATA'; payload: { nodes: GraphNode[]; edges: GraphEdge[] } }
  | { type: 'SET_SELECTED_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'SET_ALL_HOBBIES'; payload: string[] };

const initialState: AppState = {
  users: [],
  nodes: [],
  edges: [],
  selectedUser: null,
  loading: false,
  allHobbies: [
    'Reading',
    'Gaming',
    'Cooking',
    'Sports',
    'Music',
    'Photography',
    'Traveling',
    'Painting',
    'Dancing',
    'Writing',
    'Yoga',
    'Swimming',
    'Hiking',
    'Gardening',
    'Coding',
  ],
};

const AppContext = createContext<{
  state: AppState;
  fetchUsers: () => Promise<void>;
  fetchGraphData: () => Promise<void>;
  createUser: (username: string, age: number, hobbies: string[]) => Promise<void>;
  updateUser: (id: string, username?: string, age?: number, hobbies?: string[]) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  linkUsers: (userId: string, friendId: string) => Promise<void>;
  unlinkUsers: (userId: string, friendId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  addHobbyToUser: (userId: string, hobby: string) => Promise<void>;
} | undefined>(undefined);

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_GRAPH_DATA':
      return { ...state, nodes: action.payload.nodes, edges: action.payload.edges };
    case 'SET_SELECTED_USER':
      return { ...state, selectedUser: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map((u) => (u.id === action.payload.id ? action.payload : u)),
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter((u) => u.id !== action.payload),
      };
    case 'SET_ALL_HOBBIES':
      return { ...state, allHobbies: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const fetchUsers = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const users = await userAPI.getAllUsers();
      dispatch({ type: 'SET_USERS', payload: users });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch users');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const fetchGraphData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await userAPI.getGraphData();
      
      // Add positions to nodes
      const nodesWithPositions = data.nodes.map((node, index) => ({
        ...node,
        position: {
          x: 250 + (index % 3) * 300,
          y: 100 + Math.floor(index / 3) * 200,
        },
        type: node.data.popularityScore > 5 ? 'highScore' : 'lowScore',
      }));
      
      dispatch({
        type: 'SET_GRAPH_DATA',
        payload: { nodes: nodesWithPositions, edges: data.edges },
      });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch graph data');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const createUser = useCallback(async (username: string, age: number, hobbies: string[]) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const newUser = await userAPI.createUser({ username, age, hobbies });
      dispatch({ type: 'ADD_USER', payload: newUser });
      await fetchGraphData();
      toast.success('User created successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create user');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchGraphData]);

  const updateUser = useCallback(async (
    id: string,
    username?: string,
    age?: number,
    hobbies?: string[]
  ) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const updatedUser = await userAPI.updateUser(id, { username, age, hobbies });
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      await fetchGraphData();
      toast.success('User updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update user');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchGraphData]);

  const deleteUser = useCallback(async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await userAPI.deleteUser(id);
      dispatch({ type: 'DELETE_USER', payload: id });
      await fetchGraphData();
      toast.success('User deleted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete user');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchGraphData]);

  const linkUsers = useCallback(async (userId: string, friendId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await userAPI.linkUsers(userId, { friendId });
      await fetchGraphData();
      toast.success('Friendship created!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create friendship');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchGraphData]);

  const unlinkUsers = useCallback(async (userId: string, friendId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await userAPI.unlinkUsers(userId, { friendId });
      await fetchGraphData();
      toast.success('Friendship removed!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to remove friendship');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchGraphData]);

  const setSelectedUser = useCallback((user: User | null) => {
    dispatch({ type: 'SET_SELECTED_USER', payload: user });
  }, []);

  const addHobbyToUser = useCallback(async (userId: string, hobby: string) => {
    const user = state.users.find((u) => u.id === userId);
    if (!user) return;

    if (user.hobbies.includes(hobby)) {
      toast.info('User already has this hobby');
      return;
    }

    const newHobbies = [...user.hobbies, hobby];
    await updateUser(userId, undefined, undefined, newHobbies);
  }, [state.users, updateUser]);

  const value = {
    state,
    fetchUsers,
    fetchGraphData,
    createUser,
    updateUser,
    deleteUser,
    linkUsers,
    unlinkUsers,
    setSelectedUser,
    addHobbyToUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
