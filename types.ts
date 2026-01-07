
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  category: string;
  cost: number;
}

export interface UserProfile {
  name: string;
  department: string;
  year: string;
  bio: string;
  teachingSkills: Skill[];
  learningSkills: string[];
  medals: number;
  rating: number;
  ratingCount: number;
}

export interface User {
  id: string;
  username: string;
  password?: string;
  profile: UserProfile;
}

export type ExchangeStatus = 'requested' | 'accepted' | 'completed' | 'rejected';

export interface SkillExchange {
  id: string;
  teacherId: string;
  learnerId: string;
  skillName: string;
  cost: number;
  status: ExchangeStatus;
  createdAt: number;
  completedAt?: number;
  rating?: number;
  feedback?: string;
  notified?: boolean; // Track if the user has seen the status update
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  exchanges: SkillExchange[];
}
