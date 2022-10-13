import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/typeorm/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
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
                return this.generateAccessToken(user)
            }

            throw new HttpException("Invalid Credentials", HttpStatus.UNAUTHORIZED)
        }
    }


    async generateAccessToken(user: User) {

        const payload = {
            email: user.email,
            sub: user.id,
            name: user.name,
            AdminStatus: user.isAdmin
        }

        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
