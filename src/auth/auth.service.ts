import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  generateJwt(payload: any) {
    return this.jwtService.signAsync(payload);
  }

  async googleLogin(req: any) {
    if (!req.user) {
      throw new BadRequestException('Unaunthenticated');
    }
    const userExists = await this.userService.findUser(req.user.email);
    let newUser:
      | (User & {
          _id: Types.ObjectId;
        })
      | null = null;
    if (!userExists) {
      newUser = await this.userService.create(req.user);
    }
    const payload = {
      username: req.user.username,
      sub: userExists ? userExists._id.toString() : newUser?._id.toString(),
    };
    const token = await this.generateJwt(payload);
    return {
      access_token: token,
    };
  }
}
