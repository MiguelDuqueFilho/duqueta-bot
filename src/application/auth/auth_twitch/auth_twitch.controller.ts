import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Patch,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthTwitchService } from './auth_twitch.service';
import { AuthSignInTwitchDto } from './dto';
import { JwtAuthGuard, LocalAuthGuard } from './guard';

import { AuthGuard } from '@nestjs/passport';

@Controller('auth/twitch')
@ApiTags('auth/twitch')
export class AuthTwitchController {
  logger = new Logger(AuthTwitchController.name);

  constructor(private authTwitchService: AuthTwitchService) {}

  @Get()
  async TwitchAuth(@Res() res) {
    const redirectUrl = await this.authTwitchService.getAutorizationUrl();
    // this.logger.verbose(redirectUrl);
    res.redirect(redirectUrl);
  }

  // @HttpCode(HttpStatus.OK)
  // @ApiBody({ type: AuthSignInTwitchDto })
  // @ApiOperation({ summary: 'Login User with twitch' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'signIn Successfully',
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'The user not exists.',
  // })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    this.logger.verbose('login(@Request() req)', req.user);
    // return this.authTwitchService.signInTwitch(dto);
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  profile(@Request() req) {
    this.logger.verbose('profile(@Request() req)', req.user);
    // return this.authTwitchService.signInTwitch(dto);
    return req.user;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh Token' })
  @Patch('token/twitch/refresh')
  refresh() {
    this.logger.verbose('token/twitch/refresh - refresh()');
    return;
  }

  @Get('callback')
  @UseGuards(AuthGuard('twitch'))
  async AuthTwitchCallback(@Req() req: Request, @Res() res: Response) {
    this.logger.verbose('AuthTwitchCallback() ', req, res);

    // const refreshToken = generateRefreshToken()
    // this.authTwitchService.storeRefreshToken(refreshToken)
  }
  // res.CookieStorage('RefreshToken', refreshToken: any, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: 'strict'
  // }: any)
}
