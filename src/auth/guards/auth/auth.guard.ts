import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/auth/interface/jwt-payload';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService:JwtService, private authService:AuthService){
  }

  async canActivate(
    context: ExecutionContext,
  ):Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if(!token){
      throw new UnauthorizedException('There is no bearer token');
    }
    try {
      const payload = await  this.jwtService.verifyAsync<JwtPayload>(
        token,{
          secret: process.env.JWT_SECRET
        }
      );
      const user  = await this.authService.findUserById(payload.id);
      request['user']=user;
      if(!user){
        throw new UnauthorizedException();
      }
      if(!(await user).isActive){
        throw new UnauthorizedException();
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  extractTokenFromHeader(request:Request){
    const [type,token] = request.headers['authorization']?.split(' ')?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
