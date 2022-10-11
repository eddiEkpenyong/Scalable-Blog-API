import { Injectable } from '@nestjs/common';

@Injectable()
export class LoginDto{
    email:string
    password:string
}