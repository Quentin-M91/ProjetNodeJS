import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY: string | undefined = process.env.JWT_KEY;

export function generateToken(payload: JwtPayload): string {
    if (SECRET_KEY === undefined) {
        throw new Error('JWT_KEY is not defined');
    }
    return jwt.sign(payload, SECRET_KEY as string, { expiresIn: '1h' });
}
export function verifyToken(token: string): string | JwtPayload | null {
    if (SECRET_KEY === undefined) {
        throw new Error('JWT_KEY is not defined');
    }
    try {

        return jwt.verify(token, SECRET_KEY);

    } catch {
        return null;
    }
}