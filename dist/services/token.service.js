"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTService = void 0;
const tslib_1 = require("tslib");
const security_1 = require("@loopback/security");
const rest_1 = require("@loopback/rest");
// import {TokenService} from '@loopback/authentication';
const core_1 = require("@loopback/core");
const util_1 = require("util");
const authentication_jwt_1 = require("@loopback/authentication-jwt");
const authentication_jwt_2 = require("@loopback/authentication-jwt");
const jwt = require('jsonwebtoken');
const signAsync = util_1.promisify(jwt.sign);
const verifyAsync = util_1.promisify(jwt.verify);
let JWTService = class JWTService {
    constructor(jwtSecret, jwtExpiresIn, userRepository) {
        this.jwtSecret = jwtSecret;
        this.jwtExpiresIn = jwtExpiresIn;
        this.userRepository = userRepository;
    }
    async verifyToken(token) {
        if (!token) {
            throw new rest_1.HttpErrors.Unauthorized(`Error verifying token : 'token' is null`);
        }
        let userProfile;
        try {
            // decode user profile from token
            const decodedToken = await verifyAsync(token, this.jwtSecret);
            // don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
            userProfile = Object.assign({ [security_1.securityId]: '', name: '' }, {
                [security_1.securityId]: decodedToken.id,
                name: decodedToken.name,
                id: decodedToken.id,
            });
        }
        catch (error) {
            throw new rest_1.HttpErrors.Unauthorized(`Error verifying token : ${error.message}`);
        }
        return userProfile;
    }
    async generateToken(userProfile) {
        if (!userProfile) {
            throw new rest_1.HttpErrors.Unauthorized('Error generating token : userProfile is null');
        }
        return this.createTokens(userProfile);
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
    async decodeToken(refreshToken) {
        const userProfile = await this.verifyToken(refreshToken);
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
    async createTokens(userProfile) {
        const userInfoForToken = {
            id: userProfile[security_1.securityId],
            name: userProfile.name,
            email: userProfile.email,
        };
        const userInfoForRefreshToken = {
            id: userProfile[security_1.securityId]
        };
        // Generate a JSON Web Token
        let token;
        let refreshToken;
        try {
            token = await signAsync(userInfoForToken, this.jwtSecret, {
                expiresIn: Number(this.jwtExpiresIn),
            });
            // refreshToken is set to expire after 30 days - 30*24*60*60
            refreshToken = await signAsync(userInfoForRefreshToken, this.jwtSecret, {
                expiresIn: 2592000
            });
        }
        catch (error) {
            throw new rest_1.HttpErrors.Unauthorized(`Error encoding token : ${error}`);
        }
        console.log("!" + refreshToken);
        return {
            token: token,
            refreshToken: refreshToken
        };
    }
};
JWTService = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject(authentication_jwt_2.TokenServiceBindings.TOKEN_SECRET)),
    tslib_1.__param(1, core_1.inject(authentication_jwt_2.TokenServiceBindings.TOKEN_EXPIRES_IN)),
    tslib_1.__param(2, core_1.inject(authentication_jwt_2.UserServiceBindings.USER_REPOSITORY)),
    tslib_1.__metadata("design:paramtypes", [String, String, authentication_jwt_1.UserRepository])
], JWTService);
exports.JWTService = JWTService;
//# sourceMappingURL=token.service.js.map