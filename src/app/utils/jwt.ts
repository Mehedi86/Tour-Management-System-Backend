import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken"

export const generateToken = (payload: JwtPayload, secret: string, expiredIn: string) => {
    const token = jwt.sign(payload, secret, {
        expiredIn
    } as SignOptions)

    return token;
}

export const verifyToken = (token: string, secret: string) => {
    const verifyToken = jwt.verify(token, secret);

    return verifyToken;
}