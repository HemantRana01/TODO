import { IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldpassword123', description: 'Current password' })
  @IsString()
  current_password: string;

  @ApiProperty({ 
    example: 'newpassword123', 
    description: 'New password (min 8 chars, must contain uppercase, lowercase, number)' 
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  new_password: string;

  @ApiProperty({ 
    example: 'newpassword123', 
    description: 'Confirm new password' 
  })
  @IsString()
  confirm_password: string;
} 