import {securityId, UserProfile} from '@loopback/security';
import {HttpErrors} from "@loopback/rest";
// import {TokenService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {promisify} from 'util';
import {UserRepository} from "@loopback/authentication-jwt";
import {TokenServiceBindings, UserServiceBindings} from '@loopback/authentication-jwt';

export interface TokenServiceInternal {
  verifyToken(token: string): Promise<UserProfile>;

  generateToken(userProfile: UserProfile): Promise<object>;

  revokeToken?(token: string): Promise<boolean>;

  decodeToken(refreshToken: string): Promise<object>;
}


const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService implements TokenServiceInternal {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET) private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN) private jwtExpiresIn: string,
    @inject(UserServiceBindings.USER_REPOSITORY) private userRepository: UserRepository
  ) {}

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }

    let userProfile: UserProfile;

    try {
      // decode user profile from token
      const decodedToken = await verifyAsync(token, this.jwtSecret);
      // don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
      userProfile = Object.assign(
        {[securityId]: '', name: ''},
        {
          [securityId]: decodedToken.id,
          name: decodedToken.name,
          id: decodedToken.id,
        },
      );
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }
    return userProfile;
  }

  async generateToken(userProfile: UserProfile): Promise<object> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token : userProfile is null',
      );
    }
    return this.createTokens(userProfile)
    // const userInfoForToken = {
    //     id: userProfile[securityId],
    //     name: userProfile.name,
    //     email: userProfile.email,
    // };
    // const userInfoForRefreshToken = {
    //     id: userProfile[securityId]
    // };
    // // Generate a JSON Web Token
    // let token: string;
    // let refreshToken: string;
    // try {
    //     token = await signAsync(userInfoForToken, this.jwtSecret, {
    //         expiresIn: Number(this.jwtExpiresIn),
    //     });
    //     // refreshToken is set to expire after 30 days - 30*24*60*60
    //     refreshToken = await signAsync(userInfoForRefreshToken, this.jwtSecret, {
    //         expiresIn: 2592000
    //     });
    //
    // } catch (error) {
    //     throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
    // }
    // return {
    //     token,
    //     refreshToken
    // };
  }

  async decodeToken(refreshToken: string): Promise<object> {
    const userProfile = await this.verifyToken(refreshToken)

    return this.createTokens(userProfile);
    // const userInfoForToken = {
    //     id: user['id'],
    //     name: user.name,
    //     email: user.email,
    // };
    // const userInfoForRefreshToken = {
    //     id: user["id"]
    // };
    //
    // let token: string;
    // let refreshTokenNew: string;
    // try {
    //     token = await signAsync(userInfoForToken, this.jwtSecret, {
    //         expiresIn: Number(this.jwtExpiresIn),
    //     });
    //     // refreshToken is set to expire after 30 days - 30*24*60*60
    //     refreshTokenNew = await signAsync(userInfoForRefreshToken, this.jwtSecret, {
    //         expiresIn: 2592000
    //     });
    //
    // } catch (error) {
    //     throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
    // }
    // return {
    //     token,
    //     refreshToken: refreshTokenNew
    // };
  }

  async createTokens(userProfile: UserProfile){
    const userInfoForToken = {
      id: userProfile[securityId],
      name: userProfile.name,
      email: userProfile.email,
    };
    const userInfoForRefreshToken = {
      id: userProfile[securityId]
    };
    // Generate a JSON Web Token
    let token: string;
    let refreshToken: string;
    try {
      token = await signAsync(userInfoForToken, this.jwtSecret, {
        expiresIn: Number(this.jwtExpiresIn),
      });
      // refreshToken is set to expire after 30 days - 30*24*60*60
      refreshToken = await signAsync(userInfoForRefreshToken, this.jwtSecret, {
        expiresIn: 2592000
      });

    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
    }
    return {
      token: token,
      refreshToken: refreshToken
    };
  }
}

export type Token = {
  token: string,
  refreshToken: string
}
