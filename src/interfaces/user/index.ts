import { User } from '../../schemas/user.schema';
import { Id, Role } from '../common';

export interface SearchUserParams {
  limit: number;
  offset: number;
  email: string;
  name: string;
  contactPhone: string;
}

export interface IUserService {
  create(data: CreateUserParams): Promise<User>;
  findById(id: Id): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findAll(params: SearchUserParams): Promise<User[]>;
}

export interface CreateUserParams {
  email: string;
  password: string;
  name: string;
  contactPhone: string;
  role?: Role;
}
