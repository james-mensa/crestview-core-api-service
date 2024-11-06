import { appConfig } from '@config/appConfig';
import jwt, { Secret, SignOptions, JwtPayload } from 'jsonwebtoken';

class JwtService {
    private readonly secret: Secret;
    private readonly options: SignOptions;

    constructor( options?: SignOptions) {
        this.secret = appConfig.appSecret??'';
        this.options = options || { expiresIn: '1h' };
    }

    /**
     * Generates a JWT token.
     * @param payload - The payload to include in the token.
     * @returns The generated JWT token.
     */
    public generateToken(payload: object): string {
        return jwt.sign(payload, this.secret, this.options);
    }

    /**
     * Verifies a JWT token.
     * @param token - The JWT token to verify.
     * @returns The decoded payload if the token is valid, or throws an error.
     */
    public verifyToken(token: string): JwtPayload {
        try {
            return jwt.verify(token, this.secret) as JwtPayload;
        } catch (error) {
            throw new Error(`verification failed: ${(error as Error).message}`);
        }
    }

    /**
     * Decodes a JWT token without verifying it.
     * @param token - The JWT token to decode.
     * @returns The decoded payload, or null if the token is invalid.
     */
    public decodeToken(token: string): JwtPayload | null {
        return jwt.decode(token) as JwtPayload | null;
    }
}

// Example usage:
// const jwtService = new JwtService('your-secret-key');

// Generate a token
// const token = jwtService.generateToken({ userId: 123 });

// Verify a token
// const payload = jwtService.verifyToken(token);
// console.log(payload);

// Decode a token
// const decoded = jwtService.decodeToken(token);
// console.log(decoded);

export default JwtService;
