import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import {
  CreateUserParams,
  IUserService,
  SearchUserParams,
} from '../../interfaces/user';
import { Id } from '../../interfaces/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
  ) {}
  public async create(data: CreateUserParams): Promise<User> {
    const checkUser = await this.UserModel.findOne({ email: data.email });

    if (checkUser) {
      throw new ConflictException('Email already registered');
    }

    const hashPassword = await bcrypt.hash(data.password, 10);

    const user = new this.UserModel({
      email: data.email,
      passwordHash: hashPassword,
      name: data.name,
      contactPhone: data.contactPhone,
      role: data.role,
    });
    await user.save();

    return user;
  }

  public async findById(id: Id): Promise<User> {
    const user = await this.UserModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  public async findByEmail(email: string): Promise<User> {
    const user = await this.UserModel.findOne({ email }).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  public async findAll(params: SearchUserParams): Promise<User[]> {
    const query: { email?: RegExp; name?: RegExp; contactPhone?: RegExp } = {};

    if (params.email) query.email = new RegExp(params.email, 'i');
    if (params.name) query.name = new RegExp(params.name, 'i');
    if (params.contactPhone)
      query.contactPhone = new RegExp(params.contactPhone, 'i');

    return await this.UserModel.find(query)
      .skip(params.offset)
      .limit(params.limit)
      .exec();
  }
}
