import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { jwtConstants } from '../constants';

@Injectable({})
export class AuthService {
  logger = new Logger(AuthService.name);

  constructor(
    // private config: ConfigService,
    private jwt: JwtService, // private userService: UserService,
  ) {}
  // async signUp(dto: AuthSignUpDto) {
  //* generate password hash
  // const saltOrRounds = 6;
  // const hash = await bcrypt.hash(dto.password, saltOrRounds);
  // delete dto.password;
  //* user with same email
  // const userWithSameEmail = await this.userService.findUserByEmail(dto);
  // console.log(userWithSameEmail);
  // if (userWithSameEmail) {
  //   throw new ConflictException('User with same e-mail');
  // }
  //* save the new user in the db
  // const user = await this.userService.create(dto, hash);
  // return await this.signToken(user.id, user.email);
  // }

  // async signIn(dto: AuthSignInDto) {
  // this.logger.debug('signIn(dto: AuthDto)');
  // //* find the user by email
  // const user = await this.userService.findUserByEmail(dto);
  // //* if user does not exist throw exception
  // if (!user) throw new ForbiddenException('Credentials incorrect');
  // //* compare password
  // const isMatches = await bcrypt.compare(dto.password, user.hash);
  // //* if password incorrect throw execption
  // if (!isMatches) throw new ForbiddenException('Credentials incorrect');
  // //* send back the user
  // return await this.signToken(user.id, user.email);
  // }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string; refresh_token?: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = jwtConstants.secret;

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '10m',
      secret,
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret,
    });

    return {
      access_token: token,
      refresh_token: refreshToken,
    };
  }
}
