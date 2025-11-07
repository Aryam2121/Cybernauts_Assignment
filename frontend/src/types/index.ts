export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
  friends: string[];
  createdAt: Date;
  popularityScore: number;
}

export interface GraphNode {
  id: string;
  data: {
    username: string;
    age: number;
    hobbies: string[];
    popularityScore: number;
  };
  position?: { x: number; y: number };
  type?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface CreateUserDTO {
  username: string;
  age: number;
  hobbies: string[];
}

export interface UpdateUserDTO {
  username?: string;
  age?: number;
  hobbies?: string[];
}

export interface LinkUsersDTO {
  friendId: string;
}
