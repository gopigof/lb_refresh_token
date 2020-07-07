import { TokenServiceInternal } from '../services/token.service';
import { Credentials, MyUserService, User, UserRepository } from '@loopback/authentication-jwt';
import { UserProfile } from '@loopback/security';
export declare class NewUserRequest extends User {
    password: string;
}
export declare const TokensRequestBody: {
    description: string;
    required: boolean;
    content: {
        'application/json': {
            schema: {
                type: string;
                required: string[];
            };
        };
    };
};
export declare const CredentialsRequestBody: {
    description: string;
    required: boolean;
    content: {
        'application/json': {
            schema: {
                type: string;
                required: string[];
                properties: {
                    email: {
                        type: string;
                        format: string;
                    };
                    password: {
                        type: string;
                        minLength: number;
                    };
                };
            };
        };
    };
};
export declare class UserController {
    jwtService: TokenServiceInternal;
    userService: MyUserService;
    user: UserProfile;
    protected userRepository: UserRepository;
    constructor(jwtService: TokenServiceInternal, userService: MyUserService, user: UserProfile, userRepository: UserRepository);
    login(credentials: Credentials): Promise<object>;
    whoAmI(currentUserProfile: UserProfile): Promise<string>;
    signUp(newUserRequest: NewUserRequest): Promise<User>;
    refresh(token: string): Promise<object>;
}
