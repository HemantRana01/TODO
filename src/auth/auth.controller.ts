import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Register a new user',
    description: 'Create a new user account with username, email, and password. Returns JWT token for immediate authentication.'
  })
  @ApiBody({ 
    type: RegisterDto,
    description: 'User registration data'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User registered successfully. Returns JWT token and user information.',
    type: AuthResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid input data or validation errors' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict - Username or email already exists' 
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Login user',
    description: 'Authenticate user with username and password. Returns JWT token for API access.'
  })
  @ApiBody({ 
    type: LoginDto,
    description: 'User login credentials'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User logged in successfully. Returns JWT token and user information.',
    type: AuthResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid input data' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid credentials' 
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }
} 