import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
export class CreateAuthDto {
    
    // add validation username unique

    @IsString()
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;

}
