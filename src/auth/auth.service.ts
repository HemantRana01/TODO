import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.model';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { username, email, password, firstName, lastName } = registerDto;

    // Check if user already exists
    const existingUser = await User.query()
      .where('username', username)
      .orWhere('email', email)
      .first();

    if (existingUser) {
      throw new ConflictException(ERROR_MESSAGES.ACCOUNT_ALREADY_EXISTS);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.query().insert({
      username,
      email,
      hashedPassword: hashedPassword,
      firstName: firstName, 
      lastName: lastName,
      isActive: true,
    });

    // Generate JWT token
    const accessToken = this.generateToken(user);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      message: SUCCESS_MESSAGES.REGISTRATION_COMPLETED,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { username, password } = loginDto;

    // Find user by username
    const user = await User.query().where('username', username).first();

    if (!user || !user.isActive) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Generate JWT token
    const accessToken = this.generateToken(user);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      message: SUCCESS_MESSAGES.LOGIN_SUCCESSFUL,
    };
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '24h'),
    });
  }

  async validateUser(userId: number): Promise<User | null> {
    const user = await User.query().findById(userId);
    return user || null;
  }
} 