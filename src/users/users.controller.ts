import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService
    ){}

    @Post('register')
    registerUser(@Body()registerUser:RegisterDto){
        return this.userService.registerUser(registerUser);
    }
}
