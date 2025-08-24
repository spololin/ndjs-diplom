import { User } from '../../schemas/user.schema';
import { ID, Role } from '../../common/types';

export interface SearchUserParams {
  limit: number;
  offset: number;
  email: string;
  name: string;
  contactPhone: string;
}

export interface IUserService {
  create(data: CreateUserDto): Promise<User>;
  findById(id: ID): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findAll(params: SearchUserParams): Promise<User[]>;
}

export interface CreateUserParams {
  email: string;
  password: string;
  name: string;
  contactPhone: string;
}

export interface CreateUserDto extends CreateUserParams {
  role: Role;
}
