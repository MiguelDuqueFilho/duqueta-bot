import {
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  // @HttpCode(HttpStatus.OK)
  // @ApiBody({ type: AuthSignUpDto })
  // @ApiOperation({ summary: 'SignUp User' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'signUp Successfully',
  // })
  // @Public()
  // @UseGuards(AuthGuard('local'))
  // @Post('signup')
  // signUp(@Body() dto: AuthSignUpDto) {
  //   return this.authService.signUp(dto);
  // }
  // @HttpCode(HttpStatus.OK)
  // @ApiBody({ type: AuthSignInDto })
  // @ApiOperation({ summary: 'Login User' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'signIn Successfully',
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'The user not exists.',
  // })
  // @Post('signin')
  // signIn(@Body() dto: AuthSignInDto) {
  //   this.logger.verbose('signin(@Body() dto: AuthSignInDto)', dto);
  //   return this.authService.signIn(dto);
  // }
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh Token' })
  @Patch('token/refresh')
  refresh() {
    this.logger.verbose('refresh()');
    return;
  }
}
