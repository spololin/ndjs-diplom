import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUserDto,
  IUserService,
  SearchUserParams,
} from '../../interfaces/users';
import { ID } from 'src/common/types';
import { User, UserDocument } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectModel('User')
    private readonly usersModel: Model<UserDocument>,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    const checkUser = await this.usersModel.findOne({ email: data.email });

    if (checkUser) {
      throw new ConflictException('Email already registered');
    }

    const user = new this.usersModel({
      name: data.name,
      email: data.email,
      contactPhone: data.contactPhone,
      role: data.role,
      passwordHash: await bcrypt.hash(data.password, 10),
    });
    await user.save();

    return user;
  }
  async findById(id: ID): Promise<User> {
    const user = await this.usersModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  async findByEmail(email: string): Promise<User> {
    const user = await this.usersModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  async findAll(params: SearchUserParams): Promise<User[]> {
    return await this.usersModel
      .find({
        $or: [
          { name: params.name },
          { email: params.email },
          { contactPhone: params.contactPhone },
        ],
      })
      .skip(params.offset)
      .limit(params.limit)
      .exec();
  }
}
