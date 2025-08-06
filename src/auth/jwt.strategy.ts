import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET')|| 'default_jwt_secret',
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload.sub);
    
    if (!user || !user.is_active) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }
} 