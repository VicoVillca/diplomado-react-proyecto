export interface Task {
  id: number;
  name: string;
  done: boolean;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}