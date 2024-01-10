import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from 'src/dto/users/create-user.dto';
import { NotesService } from 'src/notes/notes.service';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly noteService: NotesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<
    User & {
      _id: Types.ObjectId;
    }
  > {
    const createdUser = await this.userModel.create(createUserDto);
    return createdUser;
  }

  async findUser(email: string): Promise<
    | (User & {
        _id: Types.ObjectId;
      })
    | false
  > {
    const userExists = await this.userModel
      .findOne({
        email: email,
      })
      .exec();
    if (userExists) return userExists;
    return false;
  }

  async getUser(userId: Types.ObjectId): Promise<any> {
    const getUser = await this.userModel.findById(userId).exec();
    const getAllNotes = await this.noteService.getAllNotes(userId);

    if (getUser)
      return {
        user: getUser,
        notes: getAllNotes,
      };
    throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
  }
}
