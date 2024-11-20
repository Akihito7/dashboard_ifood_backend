import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginDTO {

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minNumbers: 0,
    minLowercase: 0,
    minSymbols: 0,
    minUppercase: 0,
  })
  password: string;
}
