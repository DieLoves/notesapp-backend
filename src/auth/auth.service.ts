import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { verify } from 'argon2';
import { Request, Response } from 'express';
import { PrismaService } from 'src/services/prisma.service';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth-dto';

@Injectable()
export class AuthService {
  REFRESH_TOKEN_NAME = 'refresh-token';

  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private prismaService: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(authDto: AuthDto) {
    const user = await this.validateUser(authDto);
    const tokens = this.issueTokens(user.id);

    // TODO: Потом...
    // await this.saveToken(
    //   user.id,
    //   tokens.refreshToken,
    //   req.headers['user-agent'],
    // );

    return {
      user: new UserDto(user),
      ...tokens,
    };
  }

  async reg(dto: AuthDto) {
    const isFindUser = await this.userService.getByEmail(dto.email);

    if (isFindUser) {
      throw new BadRequestException('User already exists');
    }

    const user = await this.userService.create(dto);
    const tokens = this.issueTokens(user.id);

    // TODO: Потом...
    // await this.saveToken(
    //   user.id,
    //   tokens.refreshToken,
    //   req.headers['user-agent'],
    // );

    return {
      user: new UserDto(user),
      ...tokens,
    };
  }

  /** Тут вся логика на валидацию и генерацию токенов пользователей */

  async refreshToken(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.userService.getById(result.id);
    if (!user)
      throw new NotFoundException('User with this refresh token is not found!');
    const tokens = this.issueTokens(user.id);

    return {
      user: new UserDto(user),
      ...tokens,
    };
  }

  private async verifyToken(token: string) {
    try {
      return await this.jwt.verify(token);
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      } else if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('Expired token');
      } else {
        throw new UnauthorizedException('Error verifying token');
      }
    }
  }

  async test(req: Request, res: Response) {
    console.log(req);
    return {
      msg: 'Hello, world',
    };
  }

  private issueTokens(userId: string) {
    const userData = { id: userId };

    const accessToken = this.jwt.sign(userData, {
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_DAY_IN') + 'd',
    });

    const refreshToken = this.jwt.sign(userData, {
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_DAY_IN') + 'd',
    });

    return { accessToken, refreshToken };
  }

  private async validateUser(authDto: AuthDto) {
    const user = await this.userService.getByEmail(authDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isValidPassword = await verify(user.password, authDto.password);
    if (!isValidPassword)
      throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(
      expiresIn.getDate() +
        parseInt(this.configService.get('REFRESH_TOKEN_EXPIRES_DAY_IN')),
    );

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: 'localhost',
      expires: expiresIn,
      // secure: true,
      // lax if production
      sameSite: 'none',
    });
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: 'localhost',
      expires: new Date(0),
      // secure: true,
      // lax if production
      sameSite: 'none',
    });
  }

  // private async saveToken(
  //   userId: string,
  //   refresh_token: string,
  //   userAgent: string,
  // ) {
  //   const uaParser = new UAParser(userAgent);
  //   const device_info = uaParser.getDevice();
  //   const os_info = uaParser.getOS();

  //   const userData = await this.userService.getById(userId);
  //   if (!userData) {
  //     throw new Error('User not found');
  //   }
  //   if (userData.sessions.length == 5) {
  //     await this.removeSession(userData.sessions[0].id);
  //   }
  //   console.log(userId);
  //   await this.prismaService.sessions.create({
  //     data: {
  //       type: device_info.type || null,
  //       browser_name: uaParser.getBrowser().name || null,
  //       user_id: userId,
  //       expires_in: 30 * 24 * 60 * 60 * 1000,
  //       uagent: userAgent,
  //       device_name: device_info
  //         ? `${device_info.vendor || 'Unknown device'} ${device_info.model || 'Unknown model'}`
  //         : null,
  //       os_name: os_info
  //         ? `${os_info.name || 'Unknown name'} ${os_info.version || 'Unknown version'}`
  //         : null,
  //       refresh_token,
  //     },
  //   });
  //   return userData;
  // }

  // private extractToken(str: string) {
  //   return str.replace(/Bearer /gi, '');
  // }
}
