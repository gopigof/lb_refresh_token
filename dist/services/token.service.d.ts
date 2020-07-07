import { UserProfile } from '@loopback/security';
import { UserRepository } from "@loopback/authentication-jwt";
export interface TokenServiceInternal {
    verifyToken(token: string): Promise<UserProfile>;
    generateToken(userProfile: UserProfile): Promise<object>;
    revokeToken?(token: string): Promise<boolean>;
    decodeToken(refreshToken: string): Promise<object>;
}
export declare class JWTService implements TokenServiceInternal {
    private jwtSecret;
    private jwtExpiresIn;
    private userRepository;
    constructor(jwtSecret: string, jwtExpiresIn: string, userRepository: UserRepository);
    verifyToken(token: string): Promise<UserProfile>;
    generateToken(userProfile: UserProfile): Promise<object>;
    decodeToken(refreshToken: string): Promise<object>;
    createTokens(userProfile: UserProfile): Promise<{
        token: string;
        refreshToken: string;
    }>;
}
export declare type Token = {
    token: string;
    refreshToken: string;
};
