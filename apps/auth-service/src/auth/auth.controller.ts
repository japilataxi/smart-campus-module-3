import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { RoleEnum } from './enums/role.enum';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new institutional user' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with institutional email and password' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated user profile' })
  profile(@CurrentUser() user: any) {
    return this.authService.profile(user.id);
  }

  @Get('admin-area')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Example route protected for admin role' })
  adminArea() {
    return {
      message: 'Only admin users can access this route',
    };
  }

  @Get('librarian-area')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.LIBRARIAN, RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Example route protected for librarian or admin role' })
  librarianArea() {
    return {
      message: 'Only librarian or admin users can access this route',
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout current user' })
  logout() {
    return {
      message: 'Logout successful',
    };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  refresh() {
    return {
      message: 'Refresh token endpoint prepared',
    };
  }
}