import { Body, ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from '../users/dto/register.dto';
import { User } from '../typeorm/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) { }

    async registerUser(@Body() registerUser: RegisterDto) {
        //generating the salt
        const salt = await bcrypt.genSalt()

        //extracting the password from the registerUserDto
        const { password } = registerUser

        //creating the user
        const user = this.usersRepository.create(registerUser)

        //hashing the password
        user.password = await bcrypt.hash(password, salt)

        //saving the user in the db
        try {
            await this.usersRepository.save(user)
            return user
        }

        catch (error) {
            //checking if email already exists
            if (error.code === "ER_DUP_ENTRY") {
                throw new ConflictException("Email Already Exists")
            }

            else {
                throw new InternalServerErrorException()
            }
        }
    }

    async findUserByEmail(email: string): Promise<User> {
        const user = await this.usersRepository.findOneBy({ email })

        if (!user) {
            throw new HttpException("User Not Found", HttpStatus.NOT_FOUND)
        }
        return user
    }
}
