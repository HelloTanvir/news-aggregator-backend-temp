import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';

@Module({
    imports: [JwtModule.register({}), TypeOrmModule.forFeature([Auth]), UserModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
