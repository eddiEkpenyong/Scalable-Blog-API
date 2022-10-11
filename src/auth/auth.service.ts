import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService
    ) { }

    async login(@Body() login: LoginDto) {
        const { email, password } = login

        const user = await this.userService.findUserByEmail(email)
        if (!user) {
            throw new HttpException("Invalid Credentials", HttpStatus.UNAUTHORIZED)
        }
        else {
            const passwordMatch = await bcrypt.compare(password, user.password)

            if (user && passwordMatch) {
                // return this.generateAccessToken(user)
                return `${user.name} is logged in`
            }

            throw new HttpException("Invalid Credentials", HttpStatus.UNAUTHORIZED)
        }
    }
}
