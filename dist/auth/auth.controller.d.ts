import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto, RegisterUserDto } from './dto';
import { LoginResponse } from './interface/login-response';
import { User } from './entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    create(createUserDTO: CreateUserDto): Promise<User>;
    login(loginDto: LoginDto): Promise<LoginResponse>;
    register(registerUserDto: RegisterUserDto): Promise<LoginResponse>;
    findAll(req: Request): Promise<User[]>;
    checkToken(req: Request): LoginResponse;
}
