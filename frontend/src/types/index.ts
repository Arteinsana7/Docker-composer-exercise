// === USER ===
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

// === CATEGORIES ===
export type Category = 
  | 'oscillator' 
  | 'envelope' 
  | 'lfo' 
  | 'filter' 
  | 'vca' 
  | 'sequencer';

// === ARTICLE ===
export interface Article {
  _id: string;
  title: string;
  content: string;
  category: Category;
  author: User;
  createdAt: string;
  updatedAt: string;
}

// === COMMENT ===
export interface Comment {
  _id: string;
  content: string;
  author: User;
  article: string;
  createdAt: string;
}

// === AUTH ===
export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}
