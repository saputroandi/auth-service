import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Cookies, GetUser } from './decorator';
import { AuthDto } from './dto';
import { JwtGuard, JwtRefreshGuard } from './guard';
import { ResponseType, Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: ResponseType,
  ) {
    const tokens = await this.authService.signUp(dto);
    this.setJwtCookies(res, tokens);
    return tokens;
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: ResponseType,
  ) {
    const tokens = await this.authService.signIn(dto);
    this.setJwtCookies(res, tokens);
    return tokens;
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetUser('id') user_id: string,
    @Cookies('jwt') cookies: Tokens,
    @Res({ passthrough: true }) res: ResponseType,
  ) {
    const tokens = await this.authService.refreshTokens(
      user_id,
      cookies.refresh_token,
    );
    this.setJwtCookies(res, tokens);
    return tokens;
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @GetUser('id') user_id: string,
    @Res({ passthrough: true }) res: ResponseType,
  ) {
    this.unsetJwtCookies(res);
    return this.authService.logout(user_id);
  }

  private setJwtCookies(res: ResponseType, tokens: Tokens) {
    res.cookie('jwt', tokens, { httpOnly: true });
  }

  private unsetJwtCookies(res: ResponseType) {
    res.cookie('jwt', {}, { httpOnly: true });
  }
}
