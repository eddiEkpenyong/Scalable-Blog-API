import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ){}

    @Post('login')
    loginUser(@Body() login:LoginDto){
        return this.authService.login(login)
    }

    @Get('user/dashboard')
    @UseGuards(JwtAuthGuard)
    loadDashboard(@Request() req){
        return req.user
    }
}
